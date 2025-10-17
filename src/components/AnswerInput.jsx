// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Input } from '@/components/ui';

export function AnswerInput({
  direction,
  setDirection,
  angle,
  setAngle,
  distance,
  setDistance
}) {
  return <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
      <h4 className="text-xl font-semibold text-yellow-800 text-center mb-6">
        营养中心在熊猫馆的________（ ）°____米
      </h4>
      
      <div className="grid grid-cols-3 gap-4">
        {/* 方位输入 */}
        <div>
          <label className="block text-lg font-medium text-yellow-800 mb-2">方位</label>
          <Input value={direction} onChange={e => setDirection(e.target.value)} placeholder="如：北偏东" className="w-full bg-white border-yellow-300 focus:border-yellow-500 text-xl h-12 placeholder:text-lg" />
        </div>
        
        {/* 角度输入 */}
        <div>
          <label className="block text-lg font-medium text-yellow-800 mb-2">角度 (°)</label>
          <Input value={angle} onChange={e => setAngle(e.target.value)} placeholder="如：30" className="w-full bg-white border-yellow-300 focus:border-yellow-500 text-xl h-12 placeholder:text-lg" />
        </div>
        
        {/* 距离输入 */}
        <div>
          <label className="block text-lg font-medium text-yellow-800 mb-2">距离 (米)</label>
          <Input value={distance} onChange={e => setDistance(e.target.value)} placeholder="如：500" className="w-full bg-white border-yellow-300 focus:border-yellow-500 text-xl h-12 placeholder:text-lg" />
        </div>
      </div>
    </div>;
}