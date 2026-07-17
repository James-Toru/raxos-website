export const OPERATIVE_ENTRY_MIN_SECONDS = 2.35;
export const OPERATIVE_ENTRY_MAX_SECONDS = 4.1;

const OPERATIVE_ENTRY_DISTANCE_RATIO = 0.7;
const OPERATIVE_ENTRY_SPEED_PX_PER_SECOND = 480;

export function getOperativeEntryDuration(viewportWidth: number) {
  if (!Number.isFinite(viewportWidth) || viewportWidth <= 0) {
    return OPERATIVE_ENTRY_MIN_SECONDS;
  }

  const distance = viewportWidth * OPERATIVE_ENTRY_DISTANCE_RATIO;
  return Math.min(
    OPERATIVE_ENTRY_MAX_SECONDS,
    Math.max(OPERATIVE_ENTRY_MIN_SECONDS, distance / OPERATIVE_ENTRY_SPEED_PX_PER_SECOND),
  );
}
