// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, useToast } from '@/components/ui';import { ZooMap } from '@/components/ZooMap';
export default function HomePage(props) {
  const {
    $w } =
  props;
  const {
    toast } =
  useToast();
  const [currentLevel, setCurrentLevel] = useState(1);
  const startGame = () => {
    $w.utils.navigateTo({
      pageId: 'pre_challenge',
      params: {} });

  };
  return <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-800">
              🐾 动物园饲养员大挑战 🐾
            </CardTitle>
            <p className="text-gray-600 mt-2">
              北师大版五年级下册《确定位置一》数学游戏
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <img src="https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E5%8A%A8%E7%89%A9%E5%9B%AD1(2).png?sign=0d955e01eea50516df1b8aba6db7a5d9&t=1759020608" alt="动物园地图" className="mx-auto rounded-lg shadow-md" />
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mx-[1px]">
              <h3 className="font-bold text-yellow-800">游戏规则：</h3>
              <ul className="list-disc list-inside mt-2 text-yellow-700 space-y-1">
                <li>前置挑战：观察地图判断方向</li>
                <li>第一关：找到熊猫馆的位置</li>
                <li>第二关：选择动物喂食并判断位置</li>
                <li>第三关：反向判断营养中心位置</li>
              </ul>
            </div>

            <div className="text-center">
              <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg">
                开始游戏
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}