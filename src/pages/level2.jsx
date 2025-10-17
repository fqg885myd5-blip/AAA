// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@/components/ui';

const animalData = {
  '大象馆': {
    direction: '北偏西',
    angle: '60',
    distance: '1500',
    altDirection: '西偏北',
    altAngle: '30',
    emoji: '🐘',
    image: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E5%A4%A7%E8%B1%A11.png?sign=6bfbe7f2a183f3da5261c9faee674761&t=1758850706',
    videoUrl: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/video(%E5%A4%A7%E8%B1%A1).mp4?sign=d2a18f4a5f60a1461e20604954537b31&t=1758866582'
  },
  '斑马场': {
    direction: '南偏西',
    angle: '70',
    distance: '2000',
    altDirection: '西偏南',
    altAngle: '20',
    emoji: '🦓',
    image: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E6%96%91%E9%A9%AC1.png?sign=16be367dfd407d36b658a1826272b098&t=1758850149',
    videoUrl: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/video(%E6%96%91%E9%A9%AC).mp4?sign=7cfb2854fadb1128c66529718d1517ae&t=1758866838'
  },
  '猴山': {
    direction: '南偏东',
    angle: '45',
    distance: '1000',
    altDirection: '东偏南',
    altAngle: '45',
    emoji: '🐒',
    image: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E7%8C%B4%E5%B1%B11.png?sign=97140c5e302fc41e40705d04b93866&t=1758858134',
    videoUrl: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/video(%E7%8C%B4).mp4?sign=b8f5e5a6f5d61684600467419a5c7409&t=1758867388'
  },
  '海洋馆': {
    direction: '北偏东',
    angle: '30',
    distance: '500',
    altDirection: '东偏北',
    altAngle: '60',
    emoji: '🐠',
    image: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E6%B5%B7%E6%B4%8B%E9%A6%861.png?sign=c9352bf91b2ae0b2ab28c796b2212aa2&t=1758858870',
    videoUrl: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/video(%E6%B5%B7%E8%B1%9A).mp4?sign=19810042b80186830af35152b74b5418&t=1758867048'
  },
  '狮虎山': {
    direction: '东偏北',
    angle: '30',
    distance: '1000',
    altDirection: '北偏东',
    altAngle: '60',
    emoji: '🦁',
    image: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E7%8B%AE%E8%99%8E%E5%B1%B11.png?sign=9216e4ad92845c4edd7a9c8f2c2f2dcb&t=1758858016',
    videoUrl: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E7%99%BD%E8%99%8E.mp4?sign=f17140c5e767bf7f9433587a76ea4ab2&t=1758953332'
  }
};

// 班级图标映射
const classIcons = {
  'class_1': '🏫',
  'class_2': '📚',
  'class_3': '✏️',
  'class_4': '🎒',
  'class_5': '🎯',
  'class_default': '👨‍🏫'
};

// 条形统计图组件
const BarChart = ({
  data,
  maxValue,
  title
}) => {
  if (!data || Object.keys(data).length === 0) {
    return <div className="text-center py-8 bg-yellow-50 rounded-xl border-2 border-yellow-200">
        <span className="text-4xl">📊</span>
        <p className="text-sm text-yellow-700 mt-2">暂无数据</p>
      </div>;
  }
  const barColors = {
    '大象馆': 'bg-red-400',
    '斑马场': 'bg-blue-400',
    '猴山': 'bg-green-400',
    '海洋馆': 'bg-purple-400',
    '狮虎山': 'bg-orange-400'
  };
  return <div className="bg-white p-4 rounded-xl border-2 border-blue-200 shadow-sm">
      <h5 className="text-sm font-medium text-blue-800 mb-3 text-center">{title}</h5>
      <div className="space-y-2">
        {Object.entries(data).map(([animal, count]) => {
        const percentage = maxValue > 0 ? count / maxValue * 100 : 0;
        return <div key={animal} className="flex items-center">
              <div className="w-16 text-xs text-gray-600 flex items-center">
                <span className="mr-1">{animalData[animal]?.emoji || '🐾'}</span>
                <span>{animal}</span>
              </div>
              <div className="flex-1 ml-2">
                <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${barColors[animal] || 'bg-gray-400'} rounded-full transition-all duration-500 ease-out`} style={{
                width: `${percentage}%`
              }}>
                    <div className="absolute inset-0 flex items-center justify-end pr-2">
                      <span className="text-xs font-bold text-white">{count}人</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>;
      })}
      </div>
    </div>;
};
export default function Level2(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [direction, setDirection] = useState('');
  const [angle, setAngle] = useState('');
  const [distance, setDistance] = useState('');
  const [completionStats, setCompletionStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [classId, setClassId] = useState('class_default');
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [showResetPasswordInput, setShowResetPasswordInput] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [showBarChart, setShowBarChart] = useState(true); // 默认显示图表视图
  const [barChartData, setBarChartData] = useState({});
  const getStudentId = () => {
    return `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
  const playAnimalVideo = animal => {
    const videoUrl = animalData[animal].videoUrl;
    if (videoUrl) {
      setCurrentVideoUrl(videoUrl);
      setShowVideo(true);
      setTimeout(() => {
        setShowVideo(false);
        $w.utils.navigateTo({
          pageId: 'level3',
          params: {
            animal: animal
          }
        });
      }, 10000);
    } else {
      $w.utils.navigateTo({
        pageId: 'level3',
        params: {
          animal: animal
        }
      });
    }
  };
  const loadCompletionStats = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'student_completion_status',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                level: {
                  $eq: 'level2'
                }
              }, {
                isCompleted: {
                  $eq: true
                }
              }]
            }
          },
          select: {
            classId: true,
            animalType: true
          },
          getCount: true,
          pageSize: 100,
          pageNumber: 1
        }
      });
      const stats = {};
      result.records.forEach(record => {
        if (!stats[record.classId]) {
          stats[record.classId] = {};
        }
        if (!stats[record.classId][record.animalType]) {
          stats[record.classId][record.animalType] = 0;
        }
        stats[record.classId][record.animalType]++;
      });
      setCompletionStats(stats);

      // 准备条形图数据
      const allStats = {};
      result.records.forEach(record => {
        if (!allStats[record.animalType]) {
          allStats[record.animalType] = 0;
        }
        allStats[record.animalType]++;
      });
      setBarChartData(allStats);
    } catch (error) {
      console.error('加载完成统计失败:', error);
    }
  };
  const recordCompletion = async () => {
    setIsLoading(true);
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'student_completion_status',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            studentId: getStudentId(),
            level: 'level2',
            isCompleted: true,
            completedAt: Date.now(),
            classId: classId,
            animalType: selectedAnimal
          }
        }
      });
      await loadCompletionStats();
    } catch (error) {
      console.error('记录完成状态失败:', error);
      toast({
        title: "记录失败",
        description: "网络错误，请重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const resetCompletionData = async () => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'student_completion_status',
        methodName: 'wedaBatchDeleteV2',
        params: {
          filter: {
            where: {
              $and: [{
                level: {
                  $eq: 'level2'
                }
              }]
            }
          }
        }
      });
      toast({
        title: "重置成功",
        description: "完成人数统计已重置",
        duration: 2000
      });
      await loadCompletionStats();
    } catch (error) {
      console.error('重置数据失败:', error);
      toast({
        title: "重置失败",
        description: "网络错误，请重试",
        variant: "destructive"
      });
    }
  };
  const checkResetPassword = () => {
    if (resetPassword === 'KKK') {
      resetCompletionData();
      setShowResetPasswordInput(false);
      setResetPassword('');
    } else {
      toast({
        title: "密码错误",
        description: "请输入正确的重置密码",
        variant: "destructive"
      });
    }
  };
  const checkAnswer = async () => {
    if (!selectedAnimal || !direction || !angle || !distance) {
      toast({
        title: "请填写完整",
        description: "请选择动物并填写完整的位置信息",
        variant: "destructive"
      });
      return;
    }
    const animal = animalData[selectedAnimal];
    const isCorrect = direction === animal.direction && angle === animal.angle && distance === animal.distance || direction === animal.altDirection && angle === animal.altAngle && distance === animal.distance;
    if (isCorrect) {
      await recordCompletion();
      toast({
        title: "喂食成功！",
        description: `答对了！${selectedAnimal}在营养中心${animal.direction}${animal.angle}°${animal.distance}米处`,
        duration: 3000
      });
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
      audio.play();
      playAnimalVideo(selectedAnimal);
    } else {
      toast({
        title: "再想想",
        description: "位置判断不正确，请重新尝试",
        variant: "destructive"
      });
    }
  };
  useEffect(() => {
    loadCompletionStats();
  }, []);
  const maxBarValue = Math.max(...Object.values(barChartData), 1);
  return <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-6">
      <div className="max-w-4xl mx-auto">
        {showVideo && <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90">
            <div className="w-full max-w-2xl mx-4">
              <video autoPlay controls className="w-full h-auto rounded-lg shadow-xl" onEnded={() => {
            setShowVideo(false);
            $w.utils.navigateTo({
              pageId: 'level3',
              params: {
                animal: selectedAnimal
              }
            });
          }}>
                <source src={currentVideoUrl} type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
              <div className="text-center mt-4">
                <p className="text-white text-lg">{selectedAnimal}正在享用美食...</p>
                <Button onClick={() => {
              setShowVideo(false);
              $w.utils.navigateTo({
                pageId: 'level3',
                params: {
                  animal: selectedAnimal
                }
              });
            }} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                  跳过视频，直接进入第三关
                </Button>
              </div>
            </div>
          </div>}

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-800">
              第二关：选择动物喂食🐾
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 班级选择和统计区域 */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-2xl border-4 border-purple-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-purple-800 flex items-center">
                  <span className="text-lg mr-2">🏫</span>
                  班级选择：
                </label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger className="w-32 bg-white border-2 border-purple-300 rounded-xl">
                    <SelectValue placeholder="选择班级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class_1">一班 🏫</SelectItem>
                    <SelectItem value="class_2">二班 📚</SelectItem>
                    <SelectItem value="class_3">三班 ✏️</SelectItem>
                    <SelectItem value="class_4">四班 🎒</SelectItem>
                    <SelectItem value="class_5">五班 🎯</SelectItem>
                    <SelectItem value="class_default">默认班级 👨‍🏫</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 统计图表切换按钮 */}
              <div className="flex justify-center mb-4">
                <Button variant={showBarChart ? "default" : "outline"} size="sm" onClick={() => setShowBarChart(false)} className="mr-2 bg-white border-2 border-purple-300 rounded-xl px-3 py-1 text-xs">
                  <span className="mr-1">📋</span>表格视图
                </Button>
                <Button variant={showBarChart ? "outline" : "default"} size="sm" onClick={() => setShowBarChart(true)} className="bg-white border-2 border-purple-300 rounded-xl px-3 py-1 text-xs">
                  <span className="mr-1">📊</span>图表视图
                </Button>
              </div>

              {/* 统计显示区域 */}
              <div className="bg-white p-4 rounded-xl border-2 border-purple-200 shadow-md">
                <h4 className="text-sm font-medium text-purple-800 mb-3 flex items-center">
                  <span className="text-lg mr-2">{showBarChart ? '📊' : '📋'}</span>
                  完成人数统计：
                </h4>
                
                {Object.keys(completionStats).length > 0 ? showBarChart ?
              // 条形统计图视图
              <BarChart data={barChartData} maxValue={maxBarValue} title="各动物完成人数统计" /> :
              // 表格视图
              <div className="space-y-3">
                      {Object.entries(completionStats).map(([cls, animals]) => <div key={cls} className="bg-gradient-to-r from-blue-50 to-green-50 p-3 rounded-xl border-2 border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2">{classIcons[cls] || '👨‍🏫'}</span>
                            <span className="font-bold text-blue-800 text-sm">
                              {cls.replace('class_', '')}班
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {Object.entries(animals).map(([animal, count]) => <div key={animal} className="bg-white p-2 rounded-lg border border-blue-100 flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-lg mr-1">{animalData[animal]?.emoji || '🐾'}</span>
                                  <span className="text-xs text-gray-700">{animal}</span>
                                </div>
                                <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[2rem] text-center">
                                  {count}人
                                </span>
                              </div>)}
                          </div>
                        </div>)}
                    </div> : <div className="text-center py-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                    <span className="text-4xl">🐣</span>
                    <p className="text-sm text-yellow-700 mt-2">暂无完成记录，快来成为第一个吧！</p>
                  </div>}
              </div>

              {/* 重置按钮区域 */}
              <div className="mt-4 flex justify-end">
                {!showResetPasswordInput ? <Button variant="outline" size="sm" onClick={() => setShowResetPasswordInput(true)} className="text-xs bg-white hover:bg-purple-100 border-2 border-purple-300 rounded-xl px-3 py-1 transition-all duration-200 hover:scale-105">
                    <span className="mr-1">🔄</span>
                    重置统计
                  </Button> : <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border-2 border-purple-300">
                    <Input value={resetPassword} onChange={e => setResetPassword(e.target.value)} placeholder="🔑 输入密码" type="password" className="w-28 bg-white text-sm border-0" />
                    <Button size="sm" onClick={checkResetPassword} className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded-lg">
                      ✅
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                  setShowResetPasswordInput(false);
                  setResetPassword('');
                }} className="text-xs border-gray-300 text-gray-600 hover:bg-gray-50 px-2 py-1 rounded-lg">
                      ❌
                    </Button>
                  </div>}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-yellow-800 mb-3">
                选择要喂食的动物：
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(animalData).map(([animal, data]) => <button key={animal} onClick={() => setSelectedAnimal(animal)} className={`p-3 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${selectedAnimal === animal ? 'border-green-400 bg-green-100 shadow-md' : 'border-yellow-200 bg-white hover:bg-yellow-100'}`}>
                    <div className="text-center">
                      <div className="text-2xl mb-1">{data.emoji}</div>
                      <div className="text-sm font-medium text-gray-800">{animal}</div>
                    </div>
                  </button>)}
              </div>
            </div>

            {selectedAnimal && <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                <div className="text-center">
                  <img src={animalData[selectedAnimal].image} alt={selectedAnimal} className="mx-auto rounded-lg shadow-md w-full max-w-md" />
                  <p className="text-sm text-gray-600 mt-2">
                    请判断{selectedAnimal}相对于营养中心的位置
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">方向</label>
                    <Input value={direction} onChange={e => setDirection(e.target.value)} placeholder="如：北偏东" className="bg-white border-blue-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">角度 (°)</label>
                    <Input value={angle} onChange={e => setAngle(e.target.value)} placeholder="如：30" type="number" className="bg-white border-blue-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">距离 (米)</label>
                    <Input value={distance} onChange={e => setDistance(e.target.value)} placeholder="如：1000" type="number" className="bg-white border-blue-300" />
                  </div>
                </div>

                <div className="text-sm text-gray-600 bg-white p-3 rounded border border-blue-200">
                  {selectedAnimal}在营养中心的________（ ）°____米
                </div>

                <div className="flex justify-center">
                  <Button onClick={checkAnswer} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" disabled={isLoading}>
                    {isLoading ? '喂食中...' : `喂食${animalData[selectedAnimal].emoji}`}
                  </Button>
                </div>
              </div>}

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => $w.utils.navigateTo({
              pageId: 'index',
              params: {}
            })} className="border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2 rounded-full px-[16px]">
                返回首页
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}