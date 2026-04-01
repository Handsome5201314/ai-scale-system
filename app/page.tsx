/**
 * AI 量表系统 - 首页（前门）
 *
 * 功能：
 * - 展示所有已注册的医学量表
 * - 提供语音评估入口
 * - 干净、专业、医疗科技感的设计风格
 */

import { AllScales } from "@/lib/schemas/core/registry";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* 顶部导航栏 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo 和标题 */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI 量表系统</h1>
                <p className="text-xs text-gray-500">一核双门 · 医疗量表 AI 平台</p>
              </div>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="设置">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 欢迎区域 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            儿童发育行为筛查平台
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            基于国际标准医学量表，提供专业的儿童发育行为评估服务。
            <br />
            纯本地运算，数据 100% 不出户，隐私安全有保障。
          </p>
        </div>

        {/* 量表卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AllScales.map((scale) => (
            <div
              key={scale.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
            >
              {/* 卡片头部 */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-white font-bold text-2xl">{scale.id}</span>
                  </div>
                  <div className="text-white/80 text-sm">
                    {scale.questions.length} 题
                  </div>
                </div>
              </div>

              {/* 卡片内容 */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {scale.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {scale.description}
                </p>

                {/* 特征标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                    专业评估
                  </span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                    本地算分
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                    隐私安全
                  </span>
                </div>

                {/* 操作按钮 */}
                <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span>开始语音评估</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 底部说明 */}
        <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-blue-100">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">免责声明</h3>
              <p className="text-gray-600 text-sm">
                本系统提供的评估结果仅供参考，不能替代专业医疗诊断。
                如您对儿童的发育行为有任何疑虑，请及时前往正规医疗机构咨询专业医生。
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © 2026 AI 量表系统. 基于一核双门架构构建.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <a href="https://github.com/Handsome5201314/ai-scale-system" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                GitHub
              </a>
              <span>·</span>
              <span>技术支持: MCP 2024-11</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
