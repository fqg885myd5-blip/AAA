// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';

export function DrawingTools({
  isFreeDrawingMode,
  isDrawingMode,
  showCompass,
  showColorPicker,
  brushColor,
  colorOptions,
  toggleFreeDrawingMode,
  toggleDrawingMode,
  toggleCompass,
  setShowColorPicker,
  selectColor,
  clearCanvas
}) {
  return <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-blue-800">画图工具</h4>
        <div className="flex space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${isFreeDrawingMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {isFreeDrawingMode ? '自由绘画' : ''}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${isDrawingMode ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
            {isDrawingMode ? '辅助线模式' : ''}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${showCompass ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
            {showCompass ? '方向标显示' : ''}
          </span>
        </div>
      </div>
      
      {/* 模式选择按钮 */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Button onClick={toggleFreeDrawingMode} className={`${isFreeDrawingMode ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-200 hover:bg-gray-300'} text-white`}>
          {isFreeDrawingMode ? '退出自由绘画' : '自由绘画'}
        </Button>
        <Button onClick={toggleDrawingMode} className={`${isDrawingMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-200 hover:bg-gray-300'} text-white`}>
          {isDrawingMode ? '退出辅助线' : '辅助线'}
        </Button>
        <Button onClick={toggleCompass} className={`${showCompass ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-200 hover:bg-gray-300'} text-white`}>
          {showCompass ? '隐藏方向标' : '显示方向标'}
        </Button>
      </div>

      {/* 颜色选择器 */}
      <div className="mb-3">
        <Button onClick={() => setShowColorPicker(!showColorPicker)} className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
          🎨 选择颜色
        </Button>
        {showColorPicker && <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-md">
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map(color => <button key={color} onClick={() => selectColor(color)} className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${brushColor === color ? 'border-blue-500 scale-110' : 'border-gray-300'}`} style={{
            backgroundColor: color
          }} title={color} />)}
            </div>
          </div>}
      </div>

      <Button onClick={clearCanvas} variant="outline" className="w-full bg-white hover:bg-red-50 text-red-600 border-red-300">
        🗑️ 清除所有
      </Button>

      <p className="text-sm text-blue-600 mt-2">
        {isFreeDrawingMode ? '点击地图开始自由绘画标记' : isDrawingMode ? '点击地图开始画辅助线，只能绘制水平或垂直的线段' : showCompass ? '拖动方向标到地图上的任意位置' : '选择一种绘画模式开始标记'}
      </p>
    </div>;
}