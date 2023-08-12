import fs from "fs";

type Marker = {
  marker: string[];
  foundAfter: number;
};

type DetectorEvent =
  | { type: "marker-detected"; payload: Marker }
  | { type: "end"; payload: Marker | null };
type DetectorEventType = DetectorEvent["type"];
type DetectorEventPayload<T extends DetectorEventType> = Extract<
  DetectorEvent,
  { type: T }
>["payload"];

type DetectorEventHandler<T extends DetectorEventType> =
  DetectorEventPayload<T> extends never
    ? () => void
    : (payload: DetectorEventPayload<T>) => void;

type DetectorEventHandlers<T extends DetectorEventType> = Record<
  T,
  Array<DetectorEventHandler<T>>
>;

export class MessageMarkerDetector {
  private readstream: fs.ReadStream;
  private eventHandlers: DetectorEventHandlers<DetectorEventType> = {
    "marker-detected": [],
    end: [],
  };
  private markerCandidate: Marker;

  private static isValidMarker(
    { marker }: Marker,
    expectedMarkerLength: number,
  ) {
    return (
      marker.length === expectedMarkerLength &&
      new Set(marker).size === marker.length
    );
  }

  constructor(
    private markerLength: number,
    filePath: fs.PathLike,
  ) {
    this.readstream = fs.createReadStream(filePath, {
      encoding: "utf8",
      highWaterMark: markerLength,
    });
    this.markerCandidate = {
      foundAfter: 0,
      marker: [],
    };
  }

  public on<T extends DetectorEventType>(
    eventType: T,
    handler: DetectorEventHandler<T>,
  ) {
    (
      this.eventHandlers[eventType] as unknown as Array<DetectorEventHandler<T>>
    ).push(handler);
    return this;
  }

  public run() {
    this.readstream.on("close", () => {
      this.eventHandlers["end"].forEach((handler) => {
        (handler as DetectorEventHandler<"end">)(
          MessageMarkerDetector.isValidMarker(
            this.markerCandidate,
            this.markerLength,
          )
            ? this.markerCandidate
            : null,
        );
      });
    });

    this.readstream.on("data", (chunk) => {
      for (const character of Array.from(chunk.toString())) {
        this.markerCandidate.foundAfter++;
        this.markerCandidate.marker.push(character);
        if (this.markerCandidate.marker.length === this.markerLength + 1) {
          this.markerCandidate.marker.shift();
          if (
            MessageMarkerDetector.isValidMarker(
              this.markerCandidate,
              this.markerLength,
            )
          ) {
            this.readstream.destroy();
            this.eventHandlers["marker-detected"].forEach((handler) => {
              (handler as DetectorEventHandler<"marker-detected">)(
                this.markerCandidate,
              );
            });
            break;
          }
        }
      }
    });
  }
}
