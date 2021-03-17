import {
  ViewProps,
  NativeMethods,
  requireNativeComponent,
  Platform,
} from 'react-native';

export const NativeCommands = {
  pauseFromManager: 'pauseFromManager',
  seekToFromManager: 'seekToFromManager',
  goBackFiveFromManager: 'goBackFiveFromManager',
  goForwardFiveFromManager: 'goForwardFiveFromManager',
  playFromManager: 'playFromManager',
};

export type Video = {
  description: string;
  sources: string[];
  subtitle: string;
  thumb: string;
  title: string;
  id: string;
};

export interface NativeVideoPlayerProps extends ViewProps {
  // Props
  onPlayerUpdate: (e: any) => void;
  url: string;
  videoName: string;
  thumbnailUrl: string;
}

export interface TanakaImageViewProps extends ViewProps {
  url: string;
  cornerRadius: number;
}

export interface HudlPlayerProps extends ViewProps {
  // Props
  onPlayerUpdate: (e: any) => void;
  url: string;
  videoName: string;
  thumbnailUrl: string;
}

export interface HostComponent<P>
  extends Pick<
    React.ComponentClass<P>,
    Exclude<keyof React.ComponentClass<P>, 'new'>
  > {
  new (props: P, context?: any): React.Component<P> & Readonly<NativeMethods>;
}
export const VideoPlayerView = requireNativeComponent<NativeVideoPlayerProps>(
  'VideoPlayerView',
);
