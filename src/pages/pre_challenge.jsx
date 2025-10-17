// @ts-ignore;
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, useToast } from '@/components/ui';

export default function PreChallenge(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [statsPassword, setStatsPassword] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [statsType, setStatsType] = useState(''); // 'type1' 或 'type2'

  // 画笔功能状态
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#ff0000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  // 获取学生标识
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

      // 设置画布大小与图片一致
      const img = imageRef.current;
      if (img) {
        canvas.width = img.offsetWidth;
        canvas.height = img.offsetHeight;
      }
    }
  }, [brushColor]);

  // 实时更新画笔颜色
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
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

  // 开始绘画 - 修复：确保颜色正确设置
  const startDrawing = e => {
    if (!isDrawingMode) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // 确保画笔颜色正确设置
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = 3;
    if (e.type === 'touchstart') {
      e.preventDefault();
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

  // 绘画中 - 修复：确保颜色正确设置
  const draw = e => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // 确保画笔颜色正确设置
    ctx.strokeStyle = brushColor;
    if (e.type === 'touchmove') {
      e.preventDefault();
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

  // 切换绘画模式 - 修复：确保颜色正确设置
  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
    setShowColorPicker(false);
    // 开始绘画时自动显示工具栏
    if (!isDrawingMode) {
      setShowDrawingTools(true);
      // 确保画笔颜色正确设置
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = brushColor;
      }
    }
  };

  // 颜色选择 - 修复：立即更新画布颜色
  const selectColor = color => {
    setBrushColor(color);
    setShowColorPicker(false);
    // 立即更新画布颜色
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = color;
    }
  };

  // 切换工具栏显示
  const toggleDrawingTools = () => {
    setShowDrawingTools(!showDrawingTools);
    setShowColorPicker(false);
  };

  // 播放前置视频
  const playPreChallengeVideo = () => {
    setShowVideo(true);
    setTimeout(() => {
      setShowVideo(false);
      $w.utils.navigateTo({
        pageId: 'level1',
        params: {}
      });
    }, 10000);
  };

  // 加载答案统计
  const loadAnswers = async type => {
    setLoadingStats(true);
    try {
      const dataSourceName = type === 'type1' ? 'correct_answers' : 'incorrect_answers';
      const result = await $w.cloud.callDataSource({
        dataSourceName: dataSourceName,
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                level: {
                  $eq: 'pre_challenge'
                }
              }]
            }
          },
          select: {
            studentId: true,
            answerContent: true,
            submittedAt: true,
            animalType: true
          },
          orderBy: [{
            submittedAt: 'desc'
          }],
          pageSize: 100,
          pageNumber: 1
        }
      });

      // 对答案进行去重处理，统计重复次数
      const answerRecords = result.records || [];
      const answerCountMap = new Map();
      answerRecords.forEach(item => {
        const content = item.answerContent;
        if (answerCountMap.has(content)) {
          answerCountMap.set(content, answerCountMap.get(content) + 1);
        } else {
          answerCountMap.set(content, 1);
        }
      });

      // 转换为数组并添加重复次数信息
      const deduplicatedAnswers = Array.from(answerCountMap.entries()).map(([answerContent, count]) => ({
        answerContent,
        count,
        isDuplicate: count > 1
      }));
      setAnswers(deduplicatedAnswers);
      setStatsType(type);
    } catch (error) {
      console.error('加载答案统计失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载答案统计",
        variant: "destructive"
      });
    } finally {
      setLoadingStats(false);
    }
  };

  // 提交类型1答案
  const submitType1Answer = async () => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'correct_answers',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            studentId: getStudentId(),
            level: 'pre_challenge',
            answerContent: answer.trim(),
            submittedAt: Date.now(),
            animalType: '熊猫馆'
          }
        }
      });
    } catch (error) {
      console.error('提交答案失败:', error);
    }
  };

  // 提交类型2答案
  const submitType2Answer = async () => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'incorrect_answers',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            studentId: getStudentId(),
            level: 'pre_challenge',
            answerContent: answer.trim(),
            submittedAt: Date.now(),
            animalType: '熊猫馆'
          }
        }
      });
    } catch (error) {
      console.error('提交答案失败:', error);
    }
  };

  // 提交答案到数据模型
  const submitAnswer = async isType1 => {
    setIsLoading(true);
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'student_game_answers',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            studentId: getStudentId(),
            level: 'pre_challenge',
            answerContent: answer.trim(),
            submittedAt: Date.now(),
            isCorrect: isType1,
            animalType: '熊猫馆'
          }
        }
      });
      if (isType1) {
        await submitType1Answer();
      } else {
        await submitType2Answer();
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

  // 验证统计密码
  const checkStatsPassword = type => {
    const correctPassword = type === 'type1' ? 'ZZZ' : 'LLL';
    if (statsPassword === correctPassword) {
      setShowStats(true);
      setShowPasswordInput(false);
      setStatsPassword('');
      loadAnswers(type);
      toast({
        title: "验证成功",
        description: "可以查看答案统计了",
        duration: 2000
      });
    } else {
      toast({
        title: "密码错误",
        description: "请输入正确的统计密码",
        variant: "destructive"
      });
    }
  };

  // 隐藏统计
  const hideStats = () => {
    setShowStats(false);
    setAnswers([]);
    setStatsType('');
  };

  // 显示密码输入
  const showPassword = type => {
    setShowPasswordInput(true);
    setStatsType(type);
  };
  const checkAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: "请输入答案",
        description: "请填写熊猫馆的方向信息",
        variant: "destructive"
      });
      return;
    }
    const type1Answers = ['北偏东30°', '东偏北60°', '北偏东30度', '东偏北60度'];
    const isType1 = type1Answers.includes(answer.trim());
    await submitAnswer(isType1);
    if (isType1) {
      toast({
        title: "恭喜你！",
        description: "答对了！熊猫馆在营养中心北偏东30°方向",
        duration: 3000
      });
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
      audio.play();
      playPreChallengeVideo();
    } else {
      toast({
        title: "再想想",
        description: "方向判断不正确，请重新尝试",
        variant: "destructive"
      });
    }
  };
  useEffect(() => {
    // 初始化代码
  }, []);

  // 预定义颜色选项
  const colorOptions = ['#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ff00ff', '#000000'];
  return <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 前置视频播放 */}
        {showVideo && <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90">
            <div className="w-full max-w-2xl mx-4">
              <video autoPlay controls className="w-full h-auto rounded-lg shadow-xl" onEnded={() => {
            setShowVideo(false);
            $w.utils.navigateTo({
              pageId: 'level1',
              params: {}
            });
          }}>
                <source src="https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E5%89%8D%E7%BD%AE.mp4?sign=0b19bcc69ba4207b37448f3f4f284479&t=1758868434" type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
              <div className="text-center mt-4">
                <p className="text-white text-lg">准备进入第一关挑战...</p>
                <Button onClick={() => {
              setShowVideo(false);
              $w.utils.navigateTo({
                pageId: 'level1',
                params: {}
              });
            }} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                  跳过视频，直接进入第一关
                </Button>
              </div>
            </div>
          </div>}

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-800">
              前置挑战：观察方向 🧭
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 统计表按钮区域 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* 答案统计按钮 - 类型1 */}
              <div className="text-center">
                {!showPasswordInput && !showStats && <Button onClick={() => showPassword('type1')} className="w-full bg-green-500 hover:bg-green-600 text-white font-medium">
                    答案统计
                  </Button>}
              </div>

              {/* 答案统计按钮 - 类型2 */}
              <div className="text-center">
                {!showPasswordInput && !showStats && <Button onClick={() => showPassword('type2')} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium">
                    答案统计
                  </Button>}
              </div>
            </div>

            {/* 密码输入区域 */}
            {showPasswordInput && <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  答案统计密码验证
                </h4>
                <Input value={statsPassword} onChange={e => setStatsPassword(e.target.value)} placeholder="输入密码" type="password" className="w-full bg-white mb-3" />
                <div className="flex space-x-2">
                  <Button onClick={() => checkStatsPassword(statsType)} className="flex-1 bg-gray-700 hover:bg-gray-800 text-white">
                    确认
                  </Button>
                  <Button variant="outline" onClick={() => {
                setShowPasswordInput(false);
                setStatsPassword('');
                setStatsType('');
              }} className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50">
                    取消
                  </Button>
                </div>
              </div>}

            {/* 统计结果显示区域 */}
            {showStats && <div className={`p-4 rounded-lg border mb-4 ${statsType === 'type1' ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-300'}`}>
                <div className="flex justify-between items-center mb-3">
                  <h4 className={`text-sm font-medium ${statsType === 'type1' ? 'text-green-700' : 'text-blue-700'}`}>
                    答案统计
                  </h4>
                  <Button variant="ghost" size="sm" onClick={hideStats} className={`text-xs ${statsType === 'type1' ? 'text-green-600 hover:text-green-800' : 'text-blue-600 hover:text-blue-800'}`}>
                    隐藏
                  </Button>
                </div>
                {loadingStats ? <div className="text-center py-4">
                    <p className={`text-sm ${statsType === 'type1' ? 'text-green-600' : 'text-blue-600'}`}>加载中...</p>
                  </div> : answers.length > 0 ? <div className="space-y-2 max-h-48 overflow-y-auto">
                    {answers.map((item, index) => <div key={index} className={`flex items-center justify-between text-sm p-2 bg-white rounded border ${statsType === 'type1' ? 'border-green-200' : 'border-blue-200'}`}>
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${statsType === 'type1' ? item.isDuplicate ? 'text-green-600' : 'text-green-700' : item.isDuplicate ? 'text-blue-600' : 'text-blue-700'}`}>
                            {item.answerContent}
                          </span>
                          {item.isDuplicate && <span className={`text-xs px-2 py-1 rounded-full ${statsType === 'type1' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {item.count}次
                            </span>}
                        </div>
                      </div>)}
                  </div> : <p className="text-sm text-gray-500 text-center py-4">暂无记录</p>}
              </div>}

            {/* 图片和直接绘画区域 */}
            <div className="text-center relative">
              <div className="relative inline-block">
                <img ref={imageRef} src="https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E7%86%8A%E7%8C%AB%E6%96%B9%E5%90%91%E6%B7%A1.png?sign=80f1efd0b172fbf3df40585ef98f5750&t=1760348956" alt="动物园地图" className="mx-auto rounded-lg shadow-md max-w-full h-auto touch-none" />
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
              
              {/* 主画图按钮 */}
              <div className="mt-4">
                <Button onClick={toggleDrawingTools} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-all duration-200 hover:scale-105 px-6">
                  {showDrawingTools ? '隐藏工具栏' : '显示画图工具'}
                </Button>
              </div>

              {/* 隐藏式画图工具栏 */}
              {showDrawingTools && <div className="bg-yellow-50 p-3 rounded-lg border-2 border-yellow-300 mt-4 transition-all duration-300">
                  <div className="flex items-center justify-center space-x-3">
                    <Button onClick={toggleDrawingMode} className={`px-4 py-2 font-medium rounded-lg transition-all duration-200 ${isDrawingMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                      {isDrawingMode ? '✏️ 绘画中...' : '✏️ 开始绘画'}
                    </Button>
                    
                    <Button onClick={() => setShowColorPicker(!showColorPicker)} className="px-4 py-2 font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200">
                      🎨 颜色
                    </Button>
                    
                    <Button onClick={clearCanvas} className="px-4 py-2 font-medium bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-all duration-200">
                      🗑️ 清除
                    </Button>
                  </div>

                  {showColorPicker && <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 shadow-md">
                      <div className="grid grid-cols-6 gap-2 justify-center">
                        {colorOptions.map(color => <button key={color} onClick={() => selectColor(color)} className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${brushColor === color ? 'border-blue-500 scale-110' : 'border-gray-300'}`} style={{
                    backgroundColor: color
                  }} title={color} />)}
                      </div>
                    </div>}
                </div>}

              <p className="text-sm text-gray-600 mt-2">
                {isDrawingMode ? '✏️ 可以在图片上直接绘画标记方向' : '点击"显示画图工具"按钮开始标记'}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-blue-800 mb-2">
                熊猫馆在营养中心__________方向
              </label>
              <Input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="请将答案填写在此处" className="w-full" />
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={checkAnswer} className="bg-green-500 hover:bg-green-600" disabled={isLoading}>
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