import { API } from "@/server/typings";

export namespace Overview {
  type Props = {
    visible: boolean;
    data?: API.Media;
    onClose?: () => void;
    onPlay?: (item: API.MediaDetail) => void;
  };
}
