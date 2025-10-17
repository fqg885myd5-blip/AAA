// @ts-ignore;
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, useToast } from '@/components/ui';

// @ts-ignore;
import { StatisticsTable } from '@/components/StatisticsTable';
export default function Level1(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // 画笔功能状态
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#ff0000'); // 默认红色
  const [showColorPicker, setShowColorPicker] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [showDrawingModal, setShowDrawingModal] = useState(false);

  // 获取学生标识（使用设备信息或随机生成）
  const getStudentId = () => {
    return `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // 初始化画布
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3;
      ctx.strokeStyle = brushColor;
    }
  }, [brushColor]);

  // 获取触摸位置坐标
  const getTouchPosition = e => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  };

  // 开始绘画
  const startDrawing = e => {
    if (!isDrawingMode) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (e.type === 'touchstart') {
      e.preventDefault(); // 阻止默认行为，防止画面移动
      const pos = getTouchPosition(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    } else {
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
    setIsDrawing(true);
  };

  // 绘画中
  const draw = e => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (e.type === 'touchmove') {
      e.preventDefault(); // 阻止默认行为，防止画面移动
      const pos = getTouchPosition(e);
      ctx.lineTo(pos.x, pos.y);
    } else {
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    }
    ctx.stroke();
  };

  // 结束绘画
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // 清除画布
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // 切换绘画模式
  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
    setShowColorPicker(false);
  };

  // 颜色选择
  const selectColor = color => {
    setBrushColor(color);
    setShowColorPicker(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
  };

  // 打开画图模态框
  const openDrawingModal = () => {
    setShowDrawingModal(true);
    setIsDrawingMode(true);
  };

  // 关闭画图模态框
  const closeDrawingModal = () => {
    setShowDrawingModal(false);
    setIsDrawingMode(false);
    setShowColorPicker(false);
  };

  // 提交正确答案到统计1
  const submitCorrectAnswer = async () => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'correct_answers',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            studentId: getStudentId(),
            level: 'level1',
            answerContent: answer.trim(),
            submittedAt: Date.now(),
            animalType: '熊猫馆'
          }
        }
      });
    } catch (error) {
      console.error('提交正确答案失败:', error);
    }
  };

  // 提交错误答案到统计2
  const submitIncorrectAnswer = async () => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'incorrect_answers',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            studentId: getStudentId(),
            level: 'level1',
            answerContent: answer.trim(),
            submittedAt: Date.now(),
            animalType: '熊猫馆'
          }
        }
      });
    } catch (error) {
      console.error('提交错误答案失败:', error);
    }
  };

  // 提交答案到数据模型
  const submitAnswer = async isCorrect => {
    setIsLoading(true);
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'student_game_answers',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            studentId: getStudentId(),
            level: 'level1',
            answerContent: answer.trim(),
            submittedAt: Date.now(),
            isCorrect: isCorrect,
            animalType: '熊猫馆'
          }
        }
      });

      // 根据答案正确性提交到不同的统计模型
      if (isCorrect) {
        await submitCorrectAnswer();
      } else {
        await submitIncorrectAnswer();
      }
    } catch (error) {
      console.error('提交答案失败:', error);
      toast({
        title: "提交失败",
        description: "网络错误，请重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 播放熊猫吃饭视频
  const playPandaVideo = () => {
    setShowVideo(true);
    // 视频播放完成后自动进入问答页面
    setTimeout(() => {
      setShowVideo(false);
      $w.utils.navigateTo({
        pageId: 'level1_question',
        params: {}
      });
    }, 10000);
  };
  const checkAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: "请输入答案",
        description: "请填写熊猫馆的位置信息",
        variant: "destructive"
      });
      return;
    }
    // 更新正确答案列表，增加"北偏东30度1000米"和"东偏北60度1000米"
    const correctAnswers = ['北偏东30°1000米', '东偏北60°1000米', '北偏东30度1000米', '东偏北60度1000米'];
    const isCorrect = correctAnswers.includes(answer.trim());

    // 提交答案到数据库
    await submitAnswer(isCorrect);
    if (isCorrect) {
      // 播放熊猫吃饭视频
      playPandaVideo();
      toast({
        title: "恭喜你！",
        description: "答对了！熊猫馆在营养中心北偏东30°1000米处",
        duration: 3000
      });

      // 播放提示音
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
      audio.play();
    } else {
      toast({
        title: "再想想",
        description: "答案不正确，请重新尝试",
        variant: "destructive"
      });
    }
  };

  // 组件加载时获取已有答案
  useEffect(() => {// 移除加载student_game_answers的代码
  }, []);

  // 预定义颜色选项
  const colorOptions = ['#ff0000',
  // 红色
  '#0000ff',
  // 蓝色
  '#00ff00',
  // 绿色
  '#ffff00',
  // 黄色
  '#ff00ff',
  // 粉色
  '#000000' // 黑色
  ];
  return <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 熊猫视频播放 */}
        {showVideo && <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90">
            <div className="w-full max-w-2xl mx-4">
              <video autoPlay controls className="w-full h-auto rounded-lg shadow-xl" onEnded={() => {
            setShowVideo(false);
            $w.utils.navigateTo({
              pageId: 'level1_question',
              params: {}
            });
          }}>
                <source src="https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/video(%E7%86%8A%E7%8C%AB).mp4?sign=b51050691a5585e51458b01f0c7df4e5&t=1758866503" type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
              <div className="text-center mt-4">
                <p className="text-white text-lg">熊猫正在享用美食...</p>
                <Button onClick={() => {
              setShowVideo(false);
              $w.utils.navigateTo({
                pageId: 'level1_question',
                params: {}
              });
            }} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                  跳过视频，进入知识问答
                </Button>
              </div>
            </div>
          </div>}

        {/* 画图模态框 */}
        {showDrawingModal && <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90 p-4 touch-none">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">画图工具 - 标记位置</h3>
                <Button variant="ghost" size="sm" onClick={closeDrawingModal} className="text-gray-500 hover:text-gray-700">
                  ✕
                </Button>
              </div>
              
              <div className="p-4">
                {/* 画图工具栏 */}
                <div className="bg-yellow-50 p-3 rounded-lg border-2 border-yellow-300 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button onClick={toggleDrawingMode} className={`px-3 py-1 text-sm font-medium rounded-lg transition-all duration-200 ${isDrawingMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        {isDrawingMode ? '✏️ 绘画中...' : '✏️ 开始绘画'}
                      </Button>
                      
                      <Button onClick={() => setShowColorPicker(!showColorPicker)} className="px-3 py-1 text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200">
                        🎨 颜色
                      </Button>
                      
                      <Button onClick={clearCanvas} className="px-3 py-1 text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-all duration-200">
                        🗑️ 清除
                      </Button>
                    </div>
                    
                    {isDrawingMode && <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2 border border-gray-300" style={{
                    backgroundColor: brushColor
                  }}>
                  </div>
                        <span className="text-sm text-gray-600">当前颜色</span>
                      </div>}
                  </div>

                  {/* 颜色选择器 */}
                  {showColorPicker && <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 shadow-md">
                      <div className="grid grid-cols-6 gap-2">
                        {colorOptions.map(color => <button key={color} onClick={() => selectColor(color)} className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${brushColor === color ? 'border-blue-500 scale-110' : 'border-gray-300'}`} style={{
                    backgroundColor: color
                  }} title={color} />)}
                      </div>
                    </div>}
                </div>

                {/* 图片和画布容器 - 修复位置问题 */}
                <div className="text-center relative flex justify-center touch-none">
                  <div className="relative inline-block">
                    <img ref={imageRef} src="https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E7%86%8A%E7%8C%AB%E5%B8%A6%E8%A7%92%E5%BA%A6.png?sign=c775e8838afdeb7b5274758f918b7062&t=1760206511" alt="动物园地图" className="rounded-lg shadow-md max-w-full h-auto touch-none" />
                    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full rounded-lg cursor-crosshair touch-none" style={{
                  pointerEvents: isDrawingMode ? 'auto' : 'none',
                  opacity: isDrawingMode ? 1 : 0.5
                }} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={e => {
                  e.preventDefault();
                  startDrawing(e);
                }} onTouchMove={e => {
                  e.preventDefault();
                  draw(e);
                }} onTouchEnd={stopDrawing} onTouchCancel={stopDrawing} />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {isDrawingMode ? '✏️ 可以在图片上绘画标记位置' : '点击"开始绘画"按钮开始标记'}
                  </p>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={clearCanvas} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    清除画布
                  </Button>
                  <Button onClick={closeDrawingModal} className="bg-blue-500 hover:bg-blue-600 text-white">
                    完成画图
                  </Button>
                </div>
              </div>
            </div>
          </div>}

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-800">
              第一关：寻找熊猫馆 🐼
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 统计表按钮区域 - 移动到图片上方 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* 正确答案统计 */}
              <StatisticsTable dataSourceName='correct_answers' level='level1' password='ZZZ' buttonText='查看统计' buttonColor='bg-green-500 hover:bg-green-600' borderColor='border-green-300' bgColor='bg-green-50' $w={$w} />

              {/* 错误答案统计 */}
              <StatisticsTable dataSourceName='incorrect_answers' level='level1' password='LLL' buttonText='查看统计' buttonColor='bg-gray-700 hover:bg-gray-800' borderColor='border-gray-300' bgColor='bg-gray-100' $w={$w} />
            </div>

            {/* 图片预览和画图按钮 */}
            <div className="text-center">
              <img src="https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E7%86%8A%E7%8C%AB%E5%B8%A6%E8%A7%92%E5%BA%A6.png?sign=c775e8838afdeb7b5274758f918b7062&t=1760206511" alt="动物园地图" className="mx-auto rounded-lg shadow-md max-w-full h-auto mb-4" />
              <p className="text-sm text-gray-600 mb-4">观察地图，找到熊猫馆的位置</p>
              
              {/* 画图按钮 */}
              <Button onClick={openDrawingModal} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-all duration-200 hover:scale-105 px-[22px]">
                🎨 打开画图工具
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-blue-800 mb-2">
                熊猫馆在营养中心__________
              </label>
              <Input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="请将答案填写在此处" className="w-full" />
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={checkAnswer} className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-lg" disabled={isLoading}>
                {isLoading ? '提交中...' : '提交答案'}
              </Button>
              <Button variant="outline" onClick={() => $w.utils.navigateTo({
              pageId: 'index',
              params: {}
            })}>

                返回首页
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}