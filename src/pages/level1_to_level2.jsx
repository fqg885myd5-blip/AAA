// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, useToast } from '@/components/ui';

export default function Level1ToLevel2(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const checkAnswer = () => {
    if (!answer1.trim() || !answer2.trim()) {
      toast({
        title: "请填写完整",
        description: "请填写两个空格的答案",
        variant: "destructive"
      });
      return;
    }
    const isCorrect = answer1.trim() === '方向' && answer2.trim() === '距离' || answer1.trim() === '距离' && answer2.trim() === '方向';
    if (isCorrect) {
      setIsLoading(true);
      toast({
        title: "回答正确！",
        description: "恭喜你掌握了确定位置的关键要素",
        duration: 3000
      });

      // 播放正确提示音
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
      audio.play();

      // 延迟2秒后进入第二关
      setTimeout(() => {
        setIsLoading(false);
        $w.utils.navigateTo({
          pageId: 'level2',
          params: {}
        });
      }, 2000);
    } else {
      toast({
        title: "再想想",
        description: "答案不正确，请重新思考",
        variant: "destructive"
      });
    }
  };
  const goBackToLevel1 = () => {
    $w.utils.navigateTo({
      pageId: 'level1',
      params: {}
    });
  };
  return <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-800">
              🧠 知识问答环节
            </CardTitle>
            <p className="text-gray-600 mt-2">
              完成第一关后，让我们回顾一下确定位置的重要概念
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 问题区域 */}
            <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4 text-center">
                马上要从营养中心前往喜欢的动物场馆喂食，若想精准找到动物场馆的位置，必须先明确动物场馆相对于营养中心的（ ）和（ ）。
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">第一个空格</label>
                  <Input value={answer1} onChange={e => setAnswer1(e.target.value)} placeholder="请输入第一个答案" className="w-full bg-white border-blue-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">第二个空格</label>
                  <Input value={answer2} onChange={e => setAnswer2(e.target.value)} placeholder="请输入第二个答案" className="w-full bg-white border-blue-300" />
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600 text-center">
                💡 提示：这两个要素是确定位置的关键
              </div>
            </div>

            {/* 提示区域 */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                <span className="text-lg mr-2">📝</span>
                填写说明：
              </h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• 请根据第一关的经验思考答案</li>
                <li>• 两个空格的答案顺序可以交换</li>
                <li>• 答案都是两个字的词语</li>
                <li>• 答对后才能进入第二关喂食环节</li>
              </ul>
            </div>

            {/* 按钮区域 */}
            <div className="flex justify-center space-x-4">
              <Button onClick={checkAnswer} className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 hover:scale-105" disabled={isLoading}>
                {isLoading ? '验证中...' : '提交答案'}
              </Button>
              <Button variant="outline" onClick={goBackToLevel1} className="border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2 px-6 rounded-lg">
                返回第一关
              </Button>
            </div>

            {/* 提示图标 */}
            <div className="text-center">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-sm text-gray-500">仔细思考，答案就在第一关的学习中</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}