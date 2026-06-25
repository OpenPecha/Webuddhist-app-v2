/** @deprecated Use PlanSegmentAudioController / usePlanSegmentAudio instead. */
export {
  createPlanSegmentAudioController as createPlanAudioPlayer,
  type PlanSegmentAudioController as PlanAudioPlayer,
} from '@/components/plans/PlanSegmentAudioController';

export { usePlanSegmentAudio as usePlanAudioPlayer } from '@/hooks/usePlanSegmentAudio';
