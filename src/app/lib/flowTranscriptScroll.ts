interface FlowTranscriptFollowState {
  following: boolean;
  previousScrollTop: number;
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  bottomThreshold?: number;
}

/**
 * Keep following a growing transcript until the reader moves toward older
 * content. An upward move pauses immediately, even when it starts inside the
 * usual "near bottom" threshold. Following resumes once they return to the
 * bottom themselves.
 */
export function shouldFollowFlowTranscript({
  following,
  previousScrollTop,
  scrollTop,
  scrollHeight,
  clientHeight,
  bottomThreshold = 100,
}: FlowTranscriptFollowState): boolean {
  if (scrollTop < previousScrollTop - 1) return false;

  const distanceFromBottom = Math.max(0, scrollHeight - scrollTop - clientHeight);
  if (distanceFromBottom < bottomThreshold) return true;

  return following;
}
