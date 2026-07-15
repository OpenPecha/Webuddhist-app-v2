import { PHOSPHOR_ICONS } from '@/constants/app-assets';
import type { IconProps } from 'phosphor-react-native';

type HomeIconName = keyof typeof PHOSPHOR_ICONS;

interface HomeIconProps extends IconProps {
  name: HomeIconName;
}

export function HomeIcon({ name, ...props }: HomeIconProps) {
  const Icon = PHOSPHOR_ICONS[name];
  return <Icon {...props} />;
}

export function CalendarDotsIcon(props: IconProps) {
  return <HomeIcon name="calendarDots" {...props} />;
}

export function BookOpenTextIcon(props: IconProps) {
  return <HomeIcon name="homeChants" {...props} />;
}

export function TimerIcon(props: IconProps) {
  return <HomeIcon name="homeTimer" {...props} />;
}

export function ListChecksIcon(props: IconProps) {
  return <HomeIcon name="homeList" {...props} />;
}

export function ShareNetworkIcon(props: IconProps) {
  return <HomeIcon name="shareNetwork" {...props} />;
}

export function ArrowLeftIcon(props: IconProps) {
  return <HomeIcon name="arrowLeft" {...props} />;
}

export function ArrowRightIcon(props: IconProps) {
  return <HomeIcon name="arrowRight" {...props} />;
}
