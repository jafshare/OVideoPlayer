export type BaseRes<T> = {
  code: number;
  data: T;
};
export namespace API {
  type Media = {
    /**
     * 标题
     */
    title: string;
    /**
     * 封面
     */
    poster: string;
  };
  type MediaDetail = {
    /**
     * 唯一键
     */
    id: number;
    /**
     * 对应的mediaId
     */
    mediaId: number;
    /**
     * 标题
     */
    title: string;
    /**
     * 类型
     */
    mine: string;
    /**
     * 总时长
     */
    duration: string;
    /**
     * 资源标识
     */
    etag: string;
    /**
     * 资源大小
     */
    size: number;
    /**
     * 播放路径
     */
    url: string;
  };
  type MediaRes = BaseRes<Media[]>;
  type MediaDetailRes = BaseRes<MediaDetail[]>;
}
