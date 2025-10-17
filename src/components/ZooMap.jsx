// @ts-ignore;
import React from 'react';

export function ZooMap() {
  return <div className="relative w-full h-64 bg-white rounded-lg shadow-md p-4">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        <div className="text-xs text-center mt-1">营养中心</div>
      </div>
      
      {/* 熊猫馆 - 北偏东30°1000米 */}
      <div className="absolute top-1/4 right-1/4">
        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        <div className="text-xs text-center mt-1">🐼</div>
      </div>

      {/* 狮虎山 - 东偏北30°1000米 */}
      <div className="absolute top-1/3 right-1/3">
        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
        <div className="text-xs text-center mt-1">🦁</div>
      </div>

      {/* 海洋馆 - 北偏东30°500米 */}
      <div className="absolute top-1/3 right-2/5">
        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
        <div className="text-xs text-center mt-1">🐠</div>
      </div>

      {/* 大象馆 - 北偏西60°1500米 */}
      <div className="absolute top-1/4 left-1/4">
        <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
        <div className="text-xs text-center mt-1">🐘</div>
      </div>

      {/* 斑马场 - 南偏西70°2000米 */}
      <div className="absolute bottom-1/4 left-1/4">
        <div className="w-4 h-4 bg-black rounded-full"></div>
        <div className="text-xs text-center mt-1">🦓</div>
      </div>

      {/* 猴山 - 南偏东45°1000米 */}
      <div className="absolute bottom-1/3 right-1/3">
        <div className="w-4 h-4 bg-brown-500 rounded-full"></div>
        <div className="text-xs text-center mt-1">🐒</div>
      </div>
    </div>;
}