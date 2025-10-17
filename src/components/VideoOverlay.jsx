// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';

export function VideoOverlay({
  showVideo,
  setShowVideo,
  $w,
  videoRef
}) {
  if (!showVideo) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        <video ref={videoRef} autoPlay controls className="w-full h-auto rounded-lg shadow-2xl" src="https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E7%94%9F%E6%88%90%E5%8A%A8%E7%89%A9%E5%9B%AD%E5%BD%92%E8%BF%98%E8%A7%86%E9%A2%91.mp4?sign=a3366d8a4faee903a15f206dc774db81&t=1760257030" preload="auto" />
        <div className="text-center mt-4">
          <p className="text-white text-lg font-medium">视频播放中... 播放完成后自动进入第二关</p>
          <Button onClick={() => {
          setShowVideo(false);
          $w.utils.navigateTo({
            pageId: 'level2',
            params: {}
          });
        }} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white">
            跳过视频，直接进入第二关
          </Button>
        </div>
      </div>
    </div>;
}