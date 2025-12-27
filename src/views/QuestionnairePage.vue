<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">专属匹配问卷</h1>
        <p class="text-gray-600">完善你的个人资料，获得更精准的匹配推荐</p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">进度</span>
          <span class="text-sm font-medium text-gray-700">{{ currentStep }} / {{ totalSteps }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div 
            class="bg-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            :style="{ width: (currentStep / totalSteps) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-xl shadow-sm p-8">
        <!-- Step 1: Interests Survey -->
        <div v-if="currentStep === 1">
          <h2 class="text-xl font-bold mb-6">爱好问卷</h2>
          <p class="text-gray-600 mb-6">选择你感兴趣的爱好（可多选）</p>
          
          <div class="space-y-8">
            <!-- 艺术文娱类 -->
            <div>
              <h3 class="text-lg font-semibold mb-4">艺术文娱类</h3>
              <div class="grid grid-cols-2 gap-3">
                <div 
                  v-for="interest in artEntertainment" 
                  :key="interest.id"
                  @click="toggleInterest(interest.id)"
                  :class="[
                    'flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50',
                    formData.interests.includes(interest.id) ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                  ]"
                >
                  <div class="w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200"
                       :class="formData.interests.includes(interest.id) 
                         ? 'border-purple-500 bg-purple-500' 
                         : 'border-gray-300 bg-white'">
                    <div v-if="formData.interests.includes(interest.id)" 
                         class="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span class="text-sm font-medium">{{ interest.name }}</span>
                </div>
              </div>
            </div>

            <!-- 学习知识类 -->
            <div>
              <h3 class="text-lg font-semibold mb-4">学习知识类</h3>
              <div class="grid grid-cols-2 gap-3">
                <div 
                  v-for="interest in learningKnowledge" 
                  :key="interest.id"
                  @click="toggleInterest(interest.id)"
                  :class="[
                    'flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50',
                    formData.interests.includes(interest.id) ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                  ]"
                >
                  <div class="w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200"
                       :class="formData.interests.includes(interest.id) 
                         ? 'border-purple-500 bg-purple-500' 
                         : 'border-gray-300 bg-white'">
                    <div v-if="formData.interests.includes(interest.id)" 
                         class="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span class="text-sm font-medium">{{ interest.name }}</span>
                </div>
              </div>
            </div>

            <!-- 运动户外类 -->
            <div>
              <h3 class="text-lg font-semibold mb-4">运动户外类</h3>
              <div class="grid grid-cols-2 gap-3">
                <div 
                  v-for="interest in sportsOutdoors" 
                  :key="interest.id"
                  @click="toggleInterest(interest.id)"
                  :class="[
                    'flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50',
                    formData.interests.includes(interest.id) ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                  ]"
                >
                  <div class="w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200"
                       :class="formData.interests.includes(interest.id) 
                         ? 'border-purple-500 bg-purple-500' 
                         : 'border-gray-300 bg-white'">
                    <div v-if="formData.interests.includes(interest.id)" 
                         class="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span class="text-sm font-medium">{{ interest.name }}</span>
                </div>
              </div>
            </div>

            <!-- 休闲娱乐类 -->
            <div>
              <h3 class="text-lg font-semibold mb-4">休闲娱乐类</h3>
              <div class="grid grid-cols-2 gap-3">
                <div 
                  v-for="interest in leisureEntertainment" 
                  :key="interest.id"
                  @click="toggleInterest(interest.id)"
                  :class="[
                    'flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50',
                    formData.interests.includes(interest.id) ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                  ]"
                >
                  <div class="w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200"
                       :class="formData.interests.includes(interest.id) 
                         ? 'border-purple-500 bg-purple-500' 
                         : 'border-gray-300 bg-white'">
                    <div v-if="formData.interests.includes(interest.id)" 
                         class="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span class="text-sm font-medium">{{ interest.name }}</span>
                </div>
              </div>
            </div>

            <!-- 生活技能类 -->
            <div>
              <h3 class="text-lg font-semibold mb-4">生活技能类</h3>
              <div class="grid grid-cols-2 gap-3">
                <div 
                  v-for="interest in lifeSkills" 
                  :key="interest.id"
                  @click="toggleInterest(interest.id)"
                  :class="[
                    'flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50',
                    formData.interests.includes(interest.id) ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                  ]"
                >
                  <div class="w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200"
                       :class="formData.interests.includes(interest.id) 
                         ? 'border-purple-500 bg-purple-500' 
                         : 'border-gray-300 bg-white'">
                    <div v-if="formData.interests.includes(interest.id)" 
                         class="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span class="text-sm font-medium">{{ interest.name }}</span>
                </div>
              </div>
            </div>

            <!-- 社交体验类 -->
            <div>
              <h3 class="text-lg font-semibold mb-4">社交体验类</h3>
              <div class="grid grid-cols-2 gap-3">
                <div 
                  v-for="interest in socialExperience" 
                  :key="interest.id"
                  @click="toggleInterest(interest.id)"
                  :class="[
                    'flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50',
                    formData.interests.includes(interest.id) ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                  ]"
                >
                  <div class="w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200"
                       :class="formData.interests.includes(interest.id) 
                         ? 'border-purple-500 bg-purple-500' 
                         : 'border-gray-300 bg-white'">
                    <div v-if="formData.interests.includes(interest.id)" 
                         class="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span class="text-sm font-medium">{{ interest.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: 社交能量来源 -->
        <div v-if="currentStep === 2">
          <h2 class="text-xl font-bold mb-6">性格特质</h2>
          <p class="text-gray-600 mb-6">1. 你的社交能量来源是？</p>
          
          <div class="space-y-3">
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.socialEnergy === 'extroverted' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.socialEnergy" 
                type="radio" 
                value="extroverted" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">外向型</div>
                <div class="text-sm text-gray-600">通过社交活动获得能量，喜欢与人互动</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.socialEnergy === 'introverted' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.socialEnergy" 
                type="radio" 
                value="introverted" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">内向型</div>
                <div class="text-sm text-gray-600">通过独处获得能量，享受安静的个人时光</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.socialEnergy === 'ambivert' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.socialEnergy" 
                type="radio" 
                value="ambivert" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">中间型</div>
                <div class="text-sm text-gray-600">看情况而定，在不同情况下表现不同</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 3: 决策方式 -->
        <div v-if="currentStep === 3">
          <h2 class="text-xl font-bold mb-6">性格特质</h2>
          <p class="text-gray-600 mb-6">2. 你更倾向于什么样的决策方式？</p>
          
          <div class="space-y-3">
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.decisionMaking === 'rational' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.decisionMaking" 
                type="radio" 
                value="rational" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">理性型</div>
                <div class="text-sm text-gray-600">逻辑优先，善于分析利弊得失</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.decisionMaking === 'emotional' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.decisionMaking" 
                type="radio" 
                value="emotional" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">感性型</div>
                <div class="text-sm text-gray-600">感受优先，相信直觉和内心声音</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.decisionMaking === 'balanced' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.decisionMaking" 
                type="radio" 
                value="balanced" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">平衡型</div>
                <div class="text-sm text-gray-600">理性与感性并重，寻求两者平衡</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 4: 生活节奏 -->
        <div v-if="currentStep === 4">
          <h2 class="text-xl font-bold mb-6">性格特质</h2>
          <p class="text-gray-600 mb-6">3. 你更偏向什么样的生活节奏？</p>
          
          <div class="space-y-3">
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.lifeRhythm === 'planned' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.lifeRhythm" 
                type="radio" 
                value="planned" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">计划型</div>
                <div class="text-sm text-gray-600">凡事按规划进行，喜欢有计划的生活</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.lifeRhythm === 'spontaneous' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.lifeRhythm" 
                type="radio" 
                value="spontaneous" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">随性型</div>
                <div class="text-sm text-gray-600">走一步看一步，享受自由的灵活性</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.lifeRhythm === 'flexible' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.lifeRhythm" 
                type="radio" 
                value="flexible" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">弹性型</div>
                <div class="text-sm text-gray-600">在计划与随性之间找到平衡</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 5: 沟通风格 -->
        <div v-if="currentStep === 5">
          <h2 class="text-xl font-bold mb-6">性格特质</h2>
          <p class="text-gray-600 mb-6">4. 你更倾向于什么样的沟通风格？</p>
          
          <div class="space-y-3">
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.communicationStyle === 'direct' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.communicationStyle" 
                type="radio" 
                value="direct" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">直接坦率型</div>
                <div class="text-sm text-gray-600">有什么说什么，坦诚直接</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.communicationStyle === 'tactful' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.communicationStyle" 
                type="radio" 
                value="tactful" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">委婉体贴型</div>
                <div class="text-sm text-gray-600">考虑对方感受，委婉表达</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.communicationStyle === 'humorous' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.communicationStyle" 
                type="radio" 
                value="humorous" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">幽默风趣型</div>
                <div class="text-sm text-gray-600">用幽默化解尴尬，活跃气氛</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.communicationStyle === 'listening' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.communicationStyle" 
                type="radio" 
                value="listening" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">倾听为主型</div>
                <div class="text-sm text-gray-600">更多倾听他人，适时回应</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.communicationStyle === 'quiet' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.communicationStyle" 
                type="radio" 
                value="quiet" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">偶尔沉默型</div>
                <div class="text-sm text-gray-600">有时会沉默思考，不喜欢过度表达</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 6: 希望对方的社交风格 -->
        <div v-if="currentStep === 6">
          <h2 class="text-xl font-bold mb-6">理想交友对象特质</h2>
          <p class="text-gray-600 mb-6">1. 你希望对方具有什么样的社交风格？</p>
          
          <div class="space-y-3">
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredSocialStyle === 'warm_talkative' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredSocialStyle" 
                type="radio" 
                value="warm_talkative" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">热情健谈</div>
                <div class="text-sm text-gray-600">主动交流，善于营造轻松氛围</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredSocialStyle === 'gentle_quiet' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredSocialStyle" 
                type="radio" 
                value="gentle_quiet" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">温柔安静</div>
                <div class="text-sm text-gray-600">温和内敛，给人安全感</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredSocialStyle === 'humorous_cheerful' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredSocialStyle" 
                type="radio" 
                value="humorous_cheerful" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">幽默开朗</div>
                <div class="text-sm text-gray-600">乐观积极，能带来正能量</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredSocialStyle === 'intellectual' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredSocialStyle" 
                type="radio" 
                value="intellectual" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">理性深沉</div>
                <div class="text-sm text-gray-600">思维深刻，喜欢深度交流</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredSocialStyle === 'adventurous' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredSocialStyle" 
                type="radio" 
                value="adventurous" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">外向活跃</div>
                <div class="text-sm text-gray-600">精力充沛，喜欢新鲜刺激</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 7: 生活方式偏好 -->
        <div v-if="currentStep === 7">
          <h2 class="text-xl font-bold mb-6">理想交友对象特质</h2>
          <p class="text-gray-600 mb-6">2. 你更偏好什么样的生活方式？</p>
          
          <div class="space-y-3">
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredLifestyle === 'planned_regular' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredLifestyle" 
                type="radio" 
                value="planned_regular" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">规律计划型</div>
                <div class="text-sm text-gray-600">喜欢有规律的生活，做事有计划</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredLifestyle === 'flexible_spontaneous' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredLifestyle" 
                type="radio" 
                value="flexible_spontaneous" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">灵活随性型</div>
                <div class="text-sm text-gray-600">喜欢自由度高的生活，随机应变</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredLifestyle === 'social_energetic' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredLifestyle" 
                type="radio" 
                value="social_energetic" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">社交活跃型</div>
                <div class="text-sm text-gray-600">喜欢热闹的活动，朋友众多</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredLifestyle === 'peaceful_connected' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredLifestyle" 
                type="radio" 
                value="peaceful_connected" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">宁静致远型</div>
                <div class="text-sm text-gray-600">偏爱安静的生活，注重内心世界</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredLifestyle === 'balanced_harmonious' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredLifestyle" 
                type="radio" 
                value="balanced_harmonious" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">平衡和谐型</div>
                <div class="text-sm text-gray-600">在动静之间找到平衡，生活张弛有度</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 8: 兴趣范围 -->
        <div v-if="currentStep === 8">
          <h2 class="text-xl font-bold mb-6">理想交友对象特质</h2>
          <p class="text-gray-600 mb-6">3. 你希望对方在兴趣方面是什么样的？</p>
          
          <div class="space-y-3">
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredInterests === 'similar' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredInterests" 
                type="radio" 
                value="similar" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">兴趣相近</div>
                <div class="text-sm text-gray-600">有共同爱好，容易找到话题</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredInterests === 'different' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredInterests" 
                type="radio" 
                value="different" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">兴趣互补</div>
                <div class="text-sm text-gray-600">不同爱好，可以互相学习</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredInterests === 'open_exploring' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredInterests" 
                type="radio" 
                value="open_exploring" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">开放探索</div>
                <div class="text-sm text-gray-600">愿意尝试新事物，一起成长</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredInterests === 'passionate_focused' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredInterests" 
                type="radio" 
                value="passionate_focused" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">专注投入</div>
                <div class="text-sm text-gray-600">有自己热爱的事业或爱好</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 9: 沟通频率 -->
        <div v-if="currentStep === 9">
          <h2 class="text-xl font-bold mb-6">理想交友对象特质</h2>
          <p class="text-gray-600 mb-6">4. 你希望对方的沟通频率是？</p>
          
          <div class="space-y-3">
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredCommunication === 'frequent' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredCommunication" 
                type="radio" 
                value="frequent" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">频繁交流</div>
                <div class="text-sm text-gray-600">每天都有联系，分享日常</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredCommunication === 'moderate' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredCommunication" 
                type="radio" 
                value="moderate" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">适度联系</div>
                <div class="text-sm text-gray-600">有需要时联系，不过分频繁</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredCommunication === 'quality_focused' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredCommunication" 
                type="radio" 
                value="quality_focused" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">质量优先</div>
                <div class="text-sm text-gray-600">联系少但每次都很深入</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredCommunication === 'flexible_adaptable' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredCommunication" 
                type="radio" 
                value="flexible_adaptable" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">灵活适应</div>
                <div class="text-sm text-gray-600">根据彼此时间和心情调整</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 10: 聚会频率 -->
        <div v-if="currentStep === 10">
          <h2 class="text-xl font-bold mb-6">理想交友对象特质</h2>
          <p class="text-gray-600 mb-6">5. 你希望多久见一次面？</p>
          
          <div class="space-y-3">
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredMeetingFrequency === 'weekly' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredMeetingFrequency" 
                type="radio" 
                value="weekly" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">每周一次</div>
                <div class="text-sm text-gray-600">固定时间见面，保持稳定联系</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredMeetingFrequency === 'biweekly' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredMeetingFrequency" 
                type="radio" 
                value="biweekly" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">两周一次</div>
                <div class="text-sm text-gray-600">时间充裕，见面更有意义</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredMeetingFrequency === 'monthly' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredMeetingFrequency" 
                type="radio" 
                value="monthly" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">每月一次</div>
                <div class="text-sm text-gray-600">重质量胜过频率</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredMeetingFrequency === 'flexible' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredMeetingFrequency" 
                type="radio" 
                value="flexible" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">灵活安排</div>
                <div class="text-sm text-gray-600">根据实际情况安排时间</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 11: 关系节奏 -->
        <div v-if="currentStep === 11">
          <h2 class="text-xl font-bold mb-6">理想交友对象特质</h2>
          <p class="text-gray-600 mb-6">6. 你希望关系发展的节奏是？</p>
          
          <div class="space-y-3">
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredRelationshipPace === 'slow_steady' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredRelationshipPace" 
                type="radio" 
                value="slow_steady" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">慢热稳定</div>
                <div class="text-sm text-gray-600">循序渐进，深入了解</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredRelationshipPace === 'balanced_organic' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredRelationshipPace" 
                type="radio" 
                value="balanced_organic" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">自然平衡</div>
                <div class="text-sm text-gray-600">顺其自然，根据感觉调整</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredRelationshipPace === 'warm_quick' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredRelationshipPace" 
                type="radio" 
                value="warm_quick" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">温暖快速</div>
                <div class="text-sm text-gray-600">快速升温，但保持真诚</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredRelationshipPace === 'understanding_flexible' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredRelationshipPace" 
                type="radio" 
                value="understanding_flexible" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">理解灵活</div>
                <div class="text-sm text-gray-600">理解对方的节奏，互相配合</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 12: 年龄要求 -->
        <div v-if="currentStep === 12">
          <h2 class="text-xl font-bold mb-6">交友要求</h2>
          <p class="text-gray-600 mb-6">1. 年龄要求</p>
          
          <div class="space-y-4">
            <!-- 无限制选项 -->
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.ageRequirement.unlimited ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.ageRequirement.unlimited" 
                type="checkbox" 
                class="mr-4 text-purple-500"
                @change="toggleUnlimitedAge"
              >
              <div>
                <div class="font-medium">无限制</div>
                <div class="text-sm text-gray-600">不限制对方年龄</div>
              </div>
            </label>

            <!-- 年龄范围选择 -->
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-2">最小年龄</label>
                  <select 
                    v-model="formData.ageRequirement.minAge" 
                    :disabled="formData.ageRequirement.unlimited"
                    class="w-full p-3 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    :class="formData.ageRequirement.unlimited ? 'bg-gray-100 text-gray-500' : 'bg-white'"
                  >
                    <option v-for="age in ageOptions" :key="age" :value="age">{{ age }}岁</option>
                  </select>
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-2">最大年龄</label>
                  <select 
                    v-model="formData.ageRequirement.maxAge" 
                    :disabled="formData.ageRequirement.unlimited"
                    class="w-full p-3 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    :class="formData.ageRequirement.unlimited ? 'bg-gray-100 text-gray-500' : 'bg-white'"
                  >
                    <option v-for="age in ageOptions" :key="age" :value="age">{{ age }}岁</option>
                  </select>
                </div>
              </div>
              
              <!-- 年龄范围错误提示 -->
              <div v-if="ageRangeError" class="text-red-500 text-sm">
                {{ ageRangeError }}
              </div>
            </div>
          </div>
        </div>

        <!-- Step 13: 距离要求 -->
        <div v-if="currentStep === 13">
          <h2 class="text-xl font-bold mb-6">交友要求</h2>
          <p class="text-gray-600 mb-6">2. 关系距离要求</p>
          
          <div class="space-y-3">
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.distanceRequirement === 'same_city' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.distanceRequirement" 
                type="radio" 
                value="same_city" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">同城</div>
                <div class="text-sm text-gray-600">希望在同一城市，方便见面</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.distanceRequirement === 'same_province' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.distanceRequirement" 
                type="radio" 
                value="same_province" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">同省</div>
                <div class="text-sm text-gray-600">同省份内，距离不要太远</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.distanceRequirement === 'same_region' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.distanceRequirement" 
                type="radio" 
                value="same_region" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">同区域</div>
                <div class="text-sm text-gray-600">相邻省份，交通便利</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.distanceRequirement === 'anywhere' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.distanceRequirement" 
                type="radio" 
                value="anywhere" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">不限距离</div>
                <div class="text-sm text-gray-600">距离不是问题，真心最重要</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 14: 必要维度 -->
        <div v-if="currentStep === 14">
          <h2 class="text-xl font-bold mb-6">交友要求</h2>
          <p class="text-gray-600 mb-6">3. 必要维度（必选2个）</p>
          
          <div class="space-y-3">
            <div 
              v-for="quality in relationshipQualities" 
              :key="quality.id"
              @click="toggleMustHaveQuality(quality.id)"
              :class="[
                'flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50',
                formData.mustHaveQualities.includes(quality.id) ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
              ]"
            >
              <div class="w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all duration-200"
                   :class="formData.mustHaveQualities.includes(quality.id) 
                     ? 'border-purple-500 bg-purple-500' 
                     : 'border-gray-300 bg-white'">
                <div v-if="formData.mustHaveQualities.includes(quality.id)" 
                     class="w-2 h-2 rounded-sm bg-white"></div>
              </div>
              <div>
                <div class="font-medium">{{ quality.name }}</div>
                <div class="text-sm text-gray-600">{{ quality.description }}</div>
              </div>
            </div>
          </div>
          
          <div class="mt-4 text-sm text-gray-600">
            已选择 {{ formData.mustHaveQualities.length }}/2 个
          </div>
        </div>

        <!-- Step 15: 优先维度 -->
        <div v-if="currentStep === 15">
          <h2 class="text-xl font-bold mb-6">交友要求</h2>
          <p class="text-gray-600 mb-6">4. 优先维度（可多选，最多3个）</p>
          
          <div class="space-y-3">
            <div 
              v-for="quality in relationshipQualities" 
              :key="quality.id"
              @click="togglePriorityQuality(quality.id)"
              :class="[
                'flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50',
                formData.priorityQualities.includes(quality.id) ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
              ]"
            >
              <div class="w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all duration-200"
                   :class="formData.priorityQualities.includes(quality.id) 
                     ? 'border-purple-500 bg-purple-500' 
                     : 'border-gray-300 bg-white'">
                <div v-if="formData.priorityQualities.includes(quality.id)" 
                     class="w-2 h-2 rounded-sm bg-white"></div>
              </div>
              <div>
                <div class="font-medium">{{ quality.name }}</div>
                <div class="text-sm text-gray-600">{{ quality.description }}</div>
              </div>
            </div>
          </div>
          
          <div class="mt-4 text-sm text-gray-600">
            已选择 {{ formData.priorityQualities.length }}/3 个
          </div>
        </div>

        <!-- Step 16: 额外要求 -->
        <div v-if="currentStep === 16">
          <h2 class="text-xl font-bold mb-6">交友要求</h2>
          <p class="text-gray-600 mb-6">5. 额外要求（选填）</p>
          
          <textarea 
            v-model="formData.additionalRequirements"
            class="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
            rows="4"
            placeholder="请描述你的其他要求或想法..."
          ></textarea>
        </div>

        <!-- Step 17: 完成 -->
        <div v-if="currentStep === 17">
          <div class="text-center py-8">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">问卷完成！</h2>
            <p class="text-gray-600 mb-6">感谢您填写问卷，我们会根据您的信息为您提供更好的匹配推荐</p>
            
            <button 
              @click="goBackToMatch"
              class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              返回匹配页面
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-8">
        <button 
          v-if="currentStep > 1"
          @click="prevStep"
          class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          上一步
        </button>
        <div v-else></div>
        
        <button 
          v-if="currentStep < 17"
          @click="canProceed ? nextStep() : null" 
          class="px-6 py-3 rounded-lg transition-colors font-medium border"
          :style="canProceed ? 'background-color: #2563eb; color: white; border-color: #2563eb; cursor: pointer;' : 'background-color: #f3f4f6; color: #1f2937; border-color: #9ca3af; cursor: not-allowed;'"
        >
          {{ currentStep === totalSteps ? '完成问卷' : '下一步' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionnairePage',
  data() {
    return {
      currentStep: 1,
      totalSteps: 17,
      formData: {
        interests: [],
        socialEnergy: '',
        decisionMaking: '',
        lifeRhythm: '',
        communicationStyle: '',
        preferredSocialStyle: '',
        preferredLifestyle: '',
        preferredInterests: '',
        preferredCommunication: '',
        preferredMeetingFrequency: '',
        preferredRelationshipPace: '',
        ageRequirement: {
          unlimited: false,
          minAge: 18,
          maxAge: 30
        },
        distanceRequirement: '',
        mustHaveQualities: [],
        priorityQualities: [],
        additionalRequirements: ''
      },
      // 爱好数据
      artEntertainment: [
        { id: 'music', name: '音乐' },
        { id: 'art', name: '绘画' },
        { id: 'photography', name: '摄影' },
        { id: 'film', name: '电影' },
        { id: 'theater', name: '戏剧' },
        { id: 'literature', name: '文学' },
        { id: 'design', name: '设计' },
        { id: 'dance', name: '舞蹈' }
      ],
      learningKnowledge: [
        { id: 'reading', name: '阅读' },
        { id: 'research', name: '研究' },
        { id: 'language', name: '语言学习' },
        { id: 'science', name: '科学' },
        { id: 'history', name: '历史' },
        { id: 'philosophy', name: '哲学' },
        { id: 'technology', name: '科技' },
        { id: 'business', name: '商业' }
      ],
      sportsOutdoors: [
        { id: 'running', name: '跑步' },
        { id: 'fitness', name: '健身' },
        { id: 'swimming', name: '游泳' },
        { id: 'cycling', name: '骑行' },
        { id: 'hiking', name: '徒步' },
        { id: 'climbing', name: '攀岩' },
        { id: 'skiing', name: '滑雪' },
        { id: 'team_sports', name: '球类运动' }
      ],
      leisureEntertainment: [
        { id: 'gaming', name: '游戏' },
        { id: 'cooking', name: '烹饪' },
        { id: 'gardening', name: '园艺' },
        { id: 'pets', name: '宠物' },
        { id: 'travel', name: '旅行' },
        { id: 'collecting', name: '收藏' },
        { id: 'crafts', name: '手工' },
        { id: 'social_media', name: '社交媒体' }
      ],
      lifeSkills: [
        { id: 'cooking_advanced', name: '烹饪技巧' },
        { id: 'home_improvement', name: '家居装修' },
        { id: 'car_maintenance', name: '汽车保养' },
        { id: 'financial_planning', name: '理财规划' },
        { id: 'time_management', name: '时间管理' },
        { id: 'productivity', name: '效率提升' },
        { id: 'self_improvement', name: '自我提升' },
        { id: 'life_hacks', name: '生活技巧' }
      ],
      socialExperience: [
        { id: 'volunteering', name: '志愿活动' },
        { id: 'networking', name: '社交网络' },
        { id: 'public_speaking', name: '公众演讲' },
        { id: 'leadership', name: '领导力' },
        { id: 'teamwork', name: '团队合作' },
        { id: 'mentoring', name: '导师指导' },
        { id: 'community', name: '社区活动' },
        { id: 'cultural_events', name: '文化活动' }
      ],
      // 关系质量数据
      relationshipQualities: [
        { id: 'trustworthy', name: '诚实可信', description: '为人诚实，值得信赖' },
        { id: 'emotionally_stable', name: '情绪稳定', description: '情绪管理能力强，不会大起大落' },
        { id: 'responsible', name: '有责任心', description: '对自己和他人负责' },
        { id: 'supportive', name: '支持鼓励', description: '能够在困难时给予支持和鼓励' },
        { id: 'communicative', name: '善于沟通', description: '愿意开诚布公地交流' },
        { id: 'optimistic', name: '乐观积极', description: '面对困难保持积极态度' },
        { id: 'independent', name: '独立自主', description: '有自己的想法和生活' },
        { id: 'caring', name: '体贴关怀', description: '关心他人，善于照顾' },
        { id: 'adventurous', name: '勇于尝试', description: '愿意一起探索新事物' },
        { id: 'stable', name: '稳重踏实', description: '性格稳重，给人安全感' }
      ],
      ageOptions: Array.from({length: 82}, (_, i) => i + 18) // 18-99岁
    }
  },
  computed: {
    canProceed() {
      switch (this.currentStep) {
        case 1:
          return this.formData.interests.length > 0
        case 2:
          return this.formData.socialEnergy !== ''
        case 3:
          return this.formData.decisionMaking !== ''
        case 4:
          return this.formData.lifeRhythm !== ''
        case 5:
          return this.formData.communicationStyle !== ''
        case 6:
          return this.formData.preferredSocialStyle !== ''
        case 7:
          return this.formData.preferredLifestyle !== ''
        case 8:
          return this.formData.preferredInterests !== ''
        case 9:
          return this.formData.preferredCommunication !== ''
        case 10:
          return this.formData.preferredMeetingFrequency !== ''
        case 11:
          return this.formData.preferredRelationshipPace !== ''
        case 12:
          return this.validateAgeRequirement()
        case 13:
          return this.formData.distanceRequirement !== ''
        case 14:
          return this.formData.mustHaveQualities.length === 2
        case 15:
          return this.formData.priorityQualities.length <= 3
        case 16:
          return true // 额外要求是选填的
        default:
          return false
      }
    },
    ageRangeError() {
      if (this.formData.ageRequirement.unlimited) {
        return ''
      }
      if (this.formData.ageRequirement.minAge > this.formData.ageRequirement.maxAge) {
        return '最小年龄不能大于最大年龄'
      }
      return ''
    }
  },
  methods: {
    toggleInterest(interestId) {
      const index = this.formData.interests.indexOf(interestId)
      if (index > -1) {
        this.formData.interests.splice(index, 1)
      } else {
        this.formData.interests.push(interestId)
      }
    },
    toggleMustHaveQuality(qualityId) {
      const index = this.formData.mustHaveQualities.indexOf(qualityId)
      if (index > -1) {
        this.formData.mustHaveQualities.splice(index, 1)
      } else if (this.formData.mustHaveQualities.length < 2) {
        this.formData.mustHaveQualities.push(qualityId)
      }
    },
    togglePriorityQuality(qualityId) {
      const index = this.formData.priorityQualities.indexOf(qualityId)
      if (index > -1) {
        this.formData.priorityQualities.splice(index, 1)
      } else if (this.formData.priorityQualities.length < 3) {
        this.formData.priorityQualities.push(qualityId)
      }
    },
    toggleUnlimitedAge() {
      if (this.formData.ageRequirement.unlimited) {
        this.formData.ageRequirement.minAge = 18
        this.formData.ageRequirement.maxAge = 99
      }
    },
    validateAgeRequirement() {
      if (this.formData.ageRequirement.unlimited) {
        return true
      }
      return this.formData.ageRequirement.minAge <= this.formData.ageRequirement.maxAge
    },
    nextStep() {
      if (this.canProceed && this.currentStep < this.totalSteps) {
        this.currentStep++
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    goBackToMatch() {
      this.$router.push('/match')
    }
  },
  watch: {
    'formData.ageRequirement.unlimited'(newVal) {
      if (newVal) {
        this.formData.ageRequirement.minAge = 18
        this.formData.ageRequirement.maxAge = 99
      }
    }
  }
}
</script>

<style scoped>
/* 自定义样式 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>