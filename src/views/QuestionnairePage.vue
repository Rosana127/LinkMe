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

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center">
          <span class="iconify mr-2 text-red-600" data-icon="mdi:alert-circle" data-inline="false"></span>
          <span class="text-red-800 text-sm">{{ errorMessage }}</span>
        </div>
      </div>

      <!-- Save Message -->
      <div v-if="saveMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-center">
          <span class="iconify mr-2 text-green-600" data-icon="mdi:check-circle" data-inline="false"></span>
          <span class="text-green-800 text-sm">{{ saveMessage }}</span>
        </div>
      </div>

      <!-- Auto Save Status -->
      <div v-if="isAutoSaving" class="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center">
          <span class="iconify mr-2 text-blue-600 animate-spin" data-icon="mdi:loading" data-inline="false"></span>
          <span class="text-blue-800 text-sm">正在自动保存...</span>
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
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredSocialStyle === 'calm_introverted' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredSocialStyle" 
                type="radio" 
                value="calm_introverted" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">沉稳内敛</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredSocialStyle === 'in_sync' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredSocialStyle" 
                type="radio" 
                value="in_sync" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">同频即可</div>
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
                   :class="formData.preferredLifestyle === 'meticulous' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredLifestyle" 
                type="radio" 
                value="meticulous" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">严谨细致</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredLifestyle === 'efficient_action' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredLifestyle" 
                type="radio" 
                value="efficient_action" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">高效行动</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredLifestyle === 'flexible_adaptable' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredLifestyle" 
                type="radio" 
                value="flexible_adaptable" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">灵活变通</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredLifestyle === 'reliable_steady' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredLifestyle" 
                type="radio" 
                value="reliable_steady" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">踏实靠谱</div>
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
                   :class="formData.preferredInterests === 'optimistic_positive' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredInterests" 
                type="radio" 
                value="optimistic_positive" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">乐观积极</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredInterests === 'calm_rational' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredInterests" 
                type="radio" 
                value="calm_rational" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">冷静理智</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredInterests === 'sensitive_empathetic' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredInterests" 
                type="radio" 
                value="sensitive_empathetic" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">敏感共情</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.preferredInterests === 'emotionally_stable' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.preferredInterests" 
                type="radio" 
                value="emotionally_stable" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">情绪稳定</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 9: 关系相处偏好 -->
        <div v-if="currentStep === 9">
          <h2 class="text-xl font-bold mb-6">关系相处偏好</h2>
          
          <!-- 问题1: 最重视的关系品质 -->
          <div class="mb-8">
            <p class="text-gray-700 mb-4 font-medium">1. 最重视的关系品质（多选，最多选 3 个）</p>
            <div class="grid grid-cols-2 gap-3">
              <div 
                v-for="quality in relationshipQualitiesOptions" 
                :key="quality.id"
                @click="toggleRelationshipQuality(quality.id)"
                :class="[
                  'flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50',
                  formData.relationshipQualities.includes(quality.id) ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                ]"
              >
                <div class="w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all duration-200"
                     :class="formData.relationshipQualities.includes(quality.id) 
                       ? 'border-purple-500 bg-purple-500' 
                       : 'border-gray-300 bg-white'">
                  <div v-if="formData.relationshipQualities.includes(quality.id)" 
                       class="w-2 h-2 rounded-sm bg-white"></div>
                </div>
                <span class="text-sm font-medium">{{ quality.name }}</span>
              </div>
            </div>
            <div class="mt-3 text-sm text-gray-600">
              已选择 {{ formData.relationshipQualities.length }}/3 个
            </div>
          </div>

          <!-- 问题2: 理想的关系模式 -->
          <div class="mb-8">
            <p class="text-gray-700 mb-4 font-medium">2. 理想的关系模式</p>
            <div class="space-y-3">
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                     :class="formData.preferredRelationshipMode === 'high_frequency' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
                <input 
                  v-model="formData.preferredRelationshipMode" 
                  type="radio" 
                  value="high_frequency" 
                  class="mr-4 text-purple-500"
                >
                <div>
                  <div class="font-medium">高频互动型（日常分享琐事）</div>
                </div>
              </label>
              
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                     :class="formData.preferredRelationshipMode === 'deep_communication' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
                <input 
                  v-model="formData.preferredRelationshipMode" 
                  type="radio" 
                  value="deep_communication" 
                  class="mr-4 text-purple-500"
                >
                <div>
                  <div class="font-medium">深度交流型（走心探讨观点）</div>
                </div>
              </label>
              
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                     :class="formData.preferredRelationshipMode === 'casual_companion' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
                <input 
                  v-model="formData.preferredRelationshipMode" 
                  type="radio" 
                  value="casual_companion" 
                  class="mr-4 text-purple-500"
                >
                <div>
                  <div class="font-medium">佛系陪伴型（有事才聊，互不打扰）</div>
                </div>
              </label>
              
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                     :class="formData.preferredRelationshipMode === 'interest_buddy' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
                <input 
                  v-model="formData.preferredRelationshipMode" 
                  type="radio" 
                  value="interest_buddy" 
                  class="mr-4 text-purple-500"
                >
                <div>
                  <div class="font-medium">兴趣搭子型（只聊共同爱好）</div>
                </div>
              </label>
            </div>
          </div>

          <!-- 问题3: 沟通期待 -->
          <div>
            <p class="text-gray-700 mb-4 font-medium">3. 沟通期待</p>
            <div class="space-y-3">
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                     :class="formData.communicationExpectation === 'instant_reply' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
                <input 
                  v-model="formData.communicationExpectation" 
                  type="radio" 
                  value="instant_reply" 
                  class="mr-4 text-purple-500"
                >
                <div>
                  <div class="font-medium">消息秒回型</div>
                </div>
              </label>
              
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                     :class="formData.communicationExpectation === 'casual_reply' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
                <input 
                  v-model="formData.communicationExpectation" 
                  type="radio" 
                  value="casual_reply" 
                  class="mr-4 text-purple-500"
                >
                <div>
                  <div class="font-medium">随缘回复型</div>
                </div>
              </label>
              
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                     :class="formData.communicationExpectation === 'timely_communication' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
                <input 
                  v-model="formData.communicationExpectation" 
                  type="radio" 
                  value="timely_communication" 
                  class="mr-4 text-purple-500"
                >
                <div>
                  <div class="font-medium">遇事及时沟通型</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Step 10: 年龄要求 -->
        <div v-if="currentStep === 10">
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

        <!-- Step 11: 距离要求 -->
        <div v-if="currentStep === 11">
          <h2 class="text-xl font-bold mb-6">交友要求</h2>
          <p class="text-gray-600 mb-6">2. 您对交友的关系距离要求？</p>
          
          <div class="space-y-3">
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.distanceRequirement === 'same_city_priority' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.distanceRequirement" 
                type="radio" 
                value="same_city_priority" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">同城优先（可线下见面）</div>
                <div class="text-sm text-gray-600">希望在同一城市，方便线下见面交流</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.distanceRequirement === 'both_ok' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.distanceRequirement" 
                type="radio" 
                value="both_ok" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">同城/异地均可（线上为主）</div>
                <div class="text-sm text-gray-600">同城或异地都可以，主要通过线上交流</div>
              </div>
            </label>
            
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                   :class="formData.distanceRequirement === 'no_limit' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
              <input 
                v-model="formData.distanceRequirement" 
                type="radio" 
                value="no_limit" 
                class="mr-4 text-purple-500"
              >
              <div>
                <div class="font-medium">不限距离</div>
                <div class="text-sm text-gray-600">距离不是问题，真心最重要</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 12: 必要维度 -->
        <div v-if="currentStep === 12">
          <h2 class="text-xl font-bold mb-6">交友要求</h2>
          <p class="text-gray-600 mb-6">3. 以下维度中，你认为必须满足的是（多选，必须选1个，最多选2个）</p>
          
          <div class="space-y-3">
            <div 
              v-for="quality in mustHaveDimensions" 
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
                <div v-if="quality.description" class="text-sm text-gray-600">{{ quality.description }}</div>
              </div>
            </div>
          </div>
          
          <div class="mt-4 text-sm text-gray-600">
            已选择 {{ formData.mustHaveQualities.length }}/2 个
            <span v-if="formData.mustHaveQualities.length === 0" class="text-red-600 ml-2">
              （必须选择1-2个）
            </span>
          </div>
        </div>

        <!-- Step 13: 优先维度 -->
        <div v-if="currentStep === 13">
          <h2 class="text-xl font-bold mb-6">交友要求</h2>
          <p class="text-gray-600 mb-6">3. 以下维度中，你认为必须满足的是（多选，必须选1个，最多选3个）</p>
          
          <div class="space-y-3">
            <div 
              v-for="quality in mustHaveDimensions" 
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
                <div v-if="quality.description" class="text-sm text-gray-600">{{ quality.description }}</div>
              </div>
            </div>
          </div>
          
          <div class="mt-4 text-sm text-gray-600">
            已选择 {{ formData.priorityQualities.length }}/3 个
            <span v-if="formData.priorityQualities.length === 0" class="text-red-600 ml-2">
              （必须选择1-3个）
            </span>
          </div>
        </div>

        <!-- Step 14: 额外要求 -->
        <div v-if="currentStep === 14">
          <h2 class="text-xl font-bold mb-6">交友要求</h2>
          <p class="text-gray-600 mb-6">5. 额外要求（选填）</p>
          
          <textarea 
            v-model="formData.additionalRequirements"
            class="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
            rows="4"
            placeholder="请描述你的其他要求或想法..."
          ></textarea>
        </div>

        <!-- Step 15: 完成 -->
        <div v-if="currentStep === 15">
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
          v-if="currentStep < 15"
          @click="canProceed ? nextStep() : null" 
          :disabled="!canProceed || isSaving"
          class="px-6 py-3 rounded-lg transition-colors font-medium border"
          :style="canProceed && !isSaving ? 'background-color: #2563eb; color: white; border-color: #2563eb; cursor: pointer;' : 'background-color: #f3f4f6; color: #1f2937; border-color: #9ca3af; cursor: not-allowed;'"
        >
          <span v-if="isSaving" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            保存中...
          </span>
          <span v-else>{{ currentStep === totalSteps - 1 ? '完成问卷' : '下一步' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { submitQuestionnaire, getQuestionnaire, updateQuestionnaire } from '@/api/questionnaire'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'QuestionnairePage',
  data() {
    return {
      currentStep: 1,
      totalSteps: 15,
      isLoading: false,
      isSaving: false,
      isAutoSaving: false,
      saveMessage: '',
      autoSaveTimer: null,
      errorMessage: '',
      formData: {
        interests: [],
        socialEnergy: '',
        decisionMaking: '',
        lifeRhythm: '',
        communicationStyle: '',
        preferredSocialStyle: '',
        preferredLifestyle: '',
        preferredInterests: '',
        relationshipQualities: [],
        preferredRelationshipMode: '',
        communicationExpectation: '',
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
        { id: 'art', name: '绘画' },
        { id: 'photography', name: '摄影' },
        { id: 'calligraphy', name: '书法' },
        { id: 'writing', name: '写作' },
        { id: 'singing', name: '歌唱' },
        { id: 'dance', name: '舞蹈' },
        { id: 'theater', name: '戏剧' },
        { id: 'instrument', name: '乐器演奏' },
        { id: 'graphic_design', name: '平面设计' },
        { id: 'video_editing', name: '视频剪辑' }
      ],
      learningKnowledge: [
        { id: 'reading', name: '阅读' },
        { id: 'programming', name: '编程' },
        { id: 'teaching', name: '教学' },
        { id: 'psychology', name: '心理学' },
        { id: 'language_learning', name: '语言学习' },
        { id: 'philosophy', name: '哲学思考' },
        { id: 'history_research', name: '历史研究' },
        { id: 'investment', name: '投资理财' },
        { id: 'public_speaking', name: '公开演讲' },
        { id: 'entrepreneurship', name: '创业项目' }
      ],
      sportsOutdoors: [
        { id: 'running', name: '跑步' },
        { id: 'fitness', name: '健身' },
        { id: 'swimming', name: '游泳' },
        { id: 'cycling', name: '骑行' },
        { id: 'fishing', name: '钓鱼' },
        { id: 'yoga', name: '瑜伽' },
        { id: 'camping', name: '露营' },
        { id: 'martial_arts', name: '武术' },
        { id: 'mountaineering', name: '登山' },
        { id: 'climbing', name: '攀岩' },
        { id: 'frisbee', name: '飞盘' },
        { id: 'team_sports', name: '球类运动' }
      ],
      leisureEntertainment: [
        { id: 'board_games', name: '桌游' },
        { id: 'card_games', name: '棋牌' },
        { id: 'magic', name: '魔术' },
        { id: 'collecting', name: '收藏' },
        { id: 'tv_shows', name: '追剧' },
        { id: 'movies', name: '看电影' },
        { id: 'music', name: '听音乐' },
        { id: 'script_killing', name: '剧本杀' },
        { id: 'escape_room', name: '密室逃脱' },
        { id: 'gaming', name: '电子游戏' }
      ],
      lifeSkills: [
        { id: 'cooking_baking', name: '烹饪/烘焙' },
        { id: 'coffee_tea_mixology', name: '咖啡/茶艺/调酒' },
        { id: 'handicraft_diy', name: '手工 DIY' },
        { id: 'sewing', name: '缝纫' },
        { id: 'home_decoration', name: '家居装饰' },
        { id: 'organizing', name: '收纳整理' },
        { id: 'floristry_gardening', name: '花艺绿植' }
      ],
      socialExperience: [
        { id: 'travel', name: '旅行' },
        { id: 'bird_watching', name: '观鸟' },
        { id: 'music_festival', name: '音乐节' },
        { id: 'concert', name: '演唱会' },
        { id: 'restaurant_hopping', name: '探店打卡' },
        { id: 'exhibition', name: '展览打卡' },
        { id: 'astronomy', name: '天文观测' },
        { id: 'volunteering', name: '公益志愿' },
        { id: 'petting', name: '撸猫撸狗' },
        { id: 'city_walk', name: 'city walk' }
      ],
      // 关系质量数据（用于必要维度和优先维度）
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
      // 关系品质选项（用于第9页）
      relationshipQualitiesOptions: [
        { id: 'sincere_frank', name: '真诚坦率' },
        { id: 'mutual_understanding', name: '相互理解' },
        { id: 'mutual_trust', name: '彼此信任' },
        { id: 'tolerant_respectful', name: '包容尊重' },
        { id: 'interesting_compatible', name: '有趣合拍' },
        { id: 'shared_values', name: '三观一致' }
      ],
      // 必要维度选项（用于第12页）
      mustHaveDimensions: [
        { id: 'age_range', name: '年龄范围' },
        { id: 'distance', name: '关系距离' },
        { id: 'interest_overlap', name: '兴趣重合度' },
        { id: 'personality_compatibility', name: '性格特质契合' },
        { id: 'relationship_mode', name: '关系模式一致' },
        { id: 'communication_style', name: '沟通风格匹配' },
        { id: 'no_requirement', name: '无要求' }
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
          return this.formData.relationshipQualities.length > 0 && 
                 this.formData.relationshipQualities.length <= 3 &&
                 this.formData.preferredRelationshipMode !== '' &&
                 this.formData.communicationExpectation !== ''
        case 10:
          return this.validateAgeRequirement()
        case 11:
          return this.formData.distanceRequirement !== ''
        case 12:
          return this.formData.mustHaveQualities.length >= 1 && this.formData.mustHaveQualities.length <= 2
        case 13:
          return this.formData.priorityQualities.length >= 1 && this.formData.priorityQualities.length <= 3
        case 14:
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
    buildQuestionnairePayload(userId, includeAdditional) {
      const ageUnlimited = this.formData.ageRequirement.unlimited
      const ageMin = ageUnlimited ? null : this.formData.ageRequirement.minAge
      const ageMax = ageUnlimited ? null : this.formData.ageRequirement.maxAge
      const mustCodes = this.formData.mustHaveQualities.includes('no_requirement') ? [] : this.formData.mustHaveQualities
      const prioCodes = this.formData.priorityQualities.includes('no_requirement') ? [] : this.formData.priorityQualities

      const payload = {
        userId,
        // user_hobby 表：兴趣爱好（数组，直接使用编码）
        interests: Array.isArray(this.formData.interests) ? this.formData.interests : [],
        // user_personality 表：性格特质（直接使用编码）
        socialEnergy: this.formData.socialEnergy || null,
        decisionMaking: this.formData.decisionMaking || null,
        lifeRhythm: this.formData.lifeRhythm || null,
        communicationStyle: this.formData.communicationStyle || null,
        // 匹配偏好
        preferredSocialStyle: this.formData.preferredSocialStyle || null,
        preferredLifestyle: this.formData.preferredLifestyle || null,
        preferredInterests: this.formData.preferredInterests || null,
        // 年龄要求（嵌套对象，按后端文档）
        ageRequirement: {
          unlimited: ageUnlimited,
          minAge: ageMin,
          maxAge: ageMax
        },
        // 距离偏好：直接使用前端编码 same_city_priority / both_ok / no_limit
        distanceRequirement: this.formData.distanceRequirement || null,
        // 关系模式：字符串编码
        preferredRelationshipMode: this.formData.preferredRelationshipMode || null,
        // 沟通期望：字符串编码
        communicationExpectation: this.formData.communicationExpectation || null,
        // 关系品质（数组，直接使用编码）
        relationshipQualities: Array.isArray(this.formData.relationshipQualities)
          ? this.formData.relationshipQualities
          : [],
        // 必须维度/优先维度（数组，直接使用编码）
        mustHaveQualities: mustCodes,
        priorityQualities: prioCodes
      }
      if (includeAdditional) {
        payload.additionalRequirements = this.formData.additionalRequirements || ''
      }
      return payload
    },
    toggleInterest(interestId) {
      const index = this.formData.interests.indexOf(interestId)
      if (index > -1) {
        this.formData.interests.splice(index, 1)
      } else {
        this.formData.interests.push(interestId)
      }
    },
    toggleRelationshipQuality(qualityId) {
      const index = this.formData.relationshipQualities.indexOf(qualityId)
      if (index > -1) {
        this.formData.relationshipQualities.splice(index, 1)
      } else if (this.formData.relationshipQualities.length < 3) {
        this.formData.relationshipQualities.push(qualityId)
      }
    },
    toggleMustHaveQuality(qualityId) {
      const index = this.formData.mustHaveQualities.indexOf(qualityId)
      
      // 如果选择"无要求"选项
      if (qualityId === 'no_requirement') {
        if (index > -1) {
          // 如果已经选择，则取消选择
          this.formData.mustHaveQualities.splice(index, 1)
        } else {
          // 如果未选择，则清除所有其他选择，只保留"无要求"
          this.formData.mustHaveQualities = ['no_requirement']
        }
        return
      }
      
      // 如果当前选择了"无要求"，则清除它
      if (this.formData.mustHaveQualities.includes('no_requirement')) {
        this.formData.mustHaveQualities = this.formData.mustHaveQualities.filter(id => id !== 'no_requirement')
      }
      
      // 处理其他选项的选择逻辑
      if (index > -1) {
        this.formData.mustHaveQualities.splice(index, 1)
      } else if (this.formData.mustHaveQualities.length < 2) {
        this.formData.mustHaveQualities.push(qualityId)
      }
    },
    togglePriorityQuality(qualityId) {
      const index = this.formData.priorityQualities.indexOf(qualityId)
      
      // 如果选择"无要求"选项
      if (qualityId === 'no_requirement') {
        if (index > -1) {
          // 如果已经选择，则取消选择
          this.formData.priorityQualities.splice(index, 1)
        } else {
          // 如果未选择，则清除所有其他选择，只保留"无要求"
          this.formData.priorityQualities = ['no_requirement']
        }
        return
      }
      
      // 如果当前选择了"无要求"，则清除它
      if (this.formData.priorityQualities.includes('no_requirement')) {
        this.formData.priorityQualities = this.formData.priorityQualities.filter(id => id !== 'no_requirement')
      }
      
      // 处理其他选项的选择逻辑
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

    // 自动保存功能
    debounceAutoSave() {
      // 清除之前的定时器
      if (this.autoSaveTimer) {
        clearTimeout(this.autoSaveTimer)
      }
      
      // 设置新的定时器，5秒后执行自动保存
      this.autoSaveTimer = setTimeout(() => {
        this.autoSave()
      }, 5000)
    },

    async autoSave() {
      if (this.isAutoSaving || this.isSaving) {
        return
      }

      // 只在有部分数据时自动保存
      const hasData = this.hasPartialData()
      if (!hasData) {
        return
      }

      this.isAutoSaving = true
      this.saveMessage = ''

      try {
        const authStore = useAuthStore()
        const userId = authStore.userId
        
        if (!userId) {
          return
        }

        const questionnaireData = this.buildQuestionnairePayload(userId, false)
        
        // 打印自动保存的数据（开发环境）
        if (import.meta.env.DEV) {
          console.log('💾 自动保存数据:', {
            userId: questionnaireData.userId,
            interests: questionnaireData.interests,
            socialEnergy: questionnaireData.socialEnergy,
            decisionMaking: questionnaireData.decisionMaking
          })
        }

        // 先尝试使用PUT更新，如果失败（404），则使用POST创建
        try {
          await updateQuestionnaire(questionnaireData)
        } catch (updateError) {
          // 如果是404错误，说明数据不存在，使用POST创建
          if (updateError.status === 404 || updateError.response?.status === 404) {
            await submitQuestionnaire(questionnaireData)
          } else {
            // 其他错误直接抛出
            throw updateError
          }
        }
        
        this.saveMessage = '草稿已自动保存'
        setTimeout(() => {
          this.saveMessage = ''
        }, 3000)
        
      } catch (error) {
        // 自动保存失败不显示错误给用户，避免干扰填写体验
        console.warn('自动保存失败:', error)
      } finally {
        this.isAutoSaving = false
      }
    },

    // 检查是否有部分数据需要保存
    hasPartialData() {
      const data = this.formData
      return (
        data.interests.length > 0 ||
        data.socialEnergy ||
        data.decisionMaking ||
        data.lifeRhythm ||
        data.communicationStyle ||
        data.preferredSocialStyle ||
        data.preferredLifestyle ||
        data.preferredInterests ||
        data.relationshipQualities.length > 0 ||
        data.preferredRelationshipMode ||
        data.communicationExpectation ||
        data.distanceRequirement ||
        data.mustHaveQualities.length > 0 ||
        data.priorityQualities.length > 0 ||
        (!data.ageRequirement.unlimited && data.ageRequirement.minAge !== 18) ||
        (!data.ageRequirement.unlimited && data.ageRequirement.maxAge !== 30)
      )
    },
    async nextStep() {
      if (!this.canProceed) {
        return
      }
      
      // 如果是第14步（最后一步），保存数据
      if (this.currentStep === this.totalSteps - 1) {
        await this.submitQuestionnaireData()
        return
      }
      
      // 进入下一步
      if (this.currentStep < this.totalSteps) {
        this.currentStep++
      }
    },
    async submitQuestionnaireData() {
      if (this.isSaving) {
        return
      }
      
      this.isSaving = true
      this.errorMessage = ''
      
      try {
        const authStore = useAuthStore()
        const userId = authStore.userId
        
        if (!userId) {
          throw new Error('用户未登录，请先登录')
        }
        
        // 准备提交的数据
        const questionnaireData = this.buildQuestionnairePayload(userId, true)
        
        // 打印完整数据，便于排查
        console.log('📤 准备提交的问卷数据（完整）:', JSON.stringify(questionnaireData, null, 2))
        console.log('📊 关键字段检查:', {
          userId: questionnaireData.userId,
          interests数量: Array.isArray(questionnaireData.interests) ? questionnaireData.interests.length : 0,
          interests内容: questionnaireData.interests,
          personality字段: {
            socialEnergy: questionnaireData.socialEnergy,
            decisionMaking: questionnaireData.decisionMaking,
            lifeRhythm: questionnaireData.lifeRhythm,
            communicationStyle: questionnaireData.communicationStyle
          },
          relationshipQualities数量: Array.isArray(questionnaireData.relationshipQualities) ? questionnaireData.relationshipQualities.length : 0
        })
        
        // 调用API保存数据（最终提交时使用POST，确保创建或更新）
        // 先尝试PUT更新，如果失败则使用POST创建
        try {
          await updateQuestionnaire(questionnaireData)
        } catch (updateError) {
          // 如果是404错误，说明数据不存在，使用POST创建
          if (updateError.status === 404 || updateError.response?.status === 404) {
            await submitQuestionnaire(questionnaireData)
          } else {
            // 其他错误直接抛出
            throw updateError
          }
        }
        
        // 保存成功提示
        this.saveMessage = '问卷提交成功！'
        setTimeout(() => {
          this.saveMessage = ''
        }, 3000)
        
        // 进入完成页面（第15步）
        if (this.currentStep < this.totalSteps) {
          this.currentStep++
        }
      } catch (error) {
        // 详细记录错误信息，便于调试
        console.error('保存问卷失败 - 完整错误对象:', {
          error,
          message: error?.message,
          status: error?.status,
          response: error?.response,
          httpData: error?.httpData,
          responseData: error?.response?.data
        })
        
        // 从多个可能的来源获取错误消息，按优先级顺序
        let errorMsg = ''
        
        // 1. 检查 error.message（最直接）
        if (error?.message && typeof error.message === 'string' && error.message.trim() && error.message !== 'No message available') {
          errorMsg = error.message.trim()
        }
        // 2. 检查 error.response.data.message（后端返回的错误消息）
        else if (error?.response?.data?.message && typeof error.response.data.message === 'string' && error.response.data.message.trim()) {
          errorMsg = error.response.data.message.trim()
        }
        // 3. 检查 error.httpData.message（request.js 处理后的错误数据）
        else if (error?.httpData?.message && typeof error.httpData.message === 'string' && error.httpData.message.trim()) {
          errorMsg = error.httpData.message.trim()
        }
        // 4. 检查 error.response.data.msg（另一种可能的字段名）
        else if (error?.response?.data?.msg && typeof error.response.data.msg === 'string' && error.response.data.msg.trim()) {
          errorMsg = error.response.data.msg.trim()
        }
        // 5. 根据状态码生成默认消息
        else if (error?.status || error?.response?.status) {
          const status = error.status || error.response.status
          switch (status) {
            case 400:
              errorMsg = '请求参数错误，请检查填写的内容'
              break
            case 401:
              errorMsg = '登录已过期，请重新登录'
              break
            case 403:
              errorMsg = '没有权限执行此操作'
              break
            case 404:
              // 404错误可能是后端API未实现
              const url = error?.config?.url || error?.request?.responseURL || ''
              if (url.includes('/questionnaire')) {
                errorMsg = '问卷API接口未实现：后端服务器未找到 /questionnaire 路由。请检查后端是否已实现问卷相关的API接口。'
              } else {
                errorMsg = '请求的资源不存在，请检查后端API是否已实现'
              }
              break
            case 500:
              errorMsg = '服务器内部错误，请稍后重试'
              break
            default:
              errorMsg = `请求失败 (状态码: ${status})`
          }
        }
        // 6. 网络错误
        else if (error?.request && !error?.response) {
          errorMsg = '网络连接失败，请检查：1. 后端服务是否运行在 localhost:8080 2. 网络连接是否正常'
        }
        
        // 确保错误消息不为空，使用默认值
        this.errorMessage = errorMsg || '保存问卷失败，请重试'
        
        // 确保不会显示 "No message available" 或空消息
        if (this.errorMessage === 'No message available' || !this.errorMessage.trim()) {
          this.errorMessage = '保存问卷失败，请重试'
        }
        
        console.log('最终错误消息:', this.errorMessage)
      } finally {
        this.isSaving = false
      }
    },
    async loadExistingQuestionnaire() {
      if (this.isLoading) {
        return
      }
      
      this.isLoading = true
      this.errorMessage = ''
      
      try {
        const authStore = useAuthStore()
        const userId = authStore.userId
        
        if (!userId) {
          this.isLoading = false
          return
        }
        
        // 尝试获取已有的问卷数据（不传userId，获取当前登录用户的数据）
        const existingData = await getQuestionnaire()
        
        // 如果存在数据，填充表单
        if (existingData && typeof existingData === 'object') {
          // 基础兴趣和性格
          if (Array.isArray(existingData.interests)) {
            this.formData.interests = existingData.interests
          }
          this.formData.socialEnergy = existingData.socialEnergy || ''
          this.formData.decisionMaking = existingData.decisionMaking || ''
          this.formData.lifeRhythm = existingData.lifeRhythm || ''
          this.formData.communicationStyle = existingData.communicationStyle || ''

          // 匹配偏好
          this.formData.preferredSocialStyle = existingData.preferredSocialStyle || ''
          this.formData.preferredLifestyle = existingData.preferredLifestyle || ''
          this.formData.preferredInterests = existingData.preferredInterests || ''

          // 年龄要求（兼容旧字段和新字段）
          if (existingData.ageRequirement) {
            const ar = existingData.ageRequirement
            const ageUnlimited = !!ar.unlimited
            const ageMin = ar.minAge != null ? ar.minAge : 18
            const ageMax = ar.maxAge != null ? ar.maxAge : 30
            this.formData.ageRequirement = { unlimited: ageUnlimited, minAge: ageMin, maxAge: ageMax }
          } else {
            const ageUnlimited = !!existingData.ageUnlimited
            const ageMin = existingData.ageMin != null ? existingData.ageMin : 18
            const ageMax = existingData.ageMax != null ? existingData.ageMax : 30
            this.formData.ageRequirement = { unlimited: ageUnlimited, minAge: ageMin, maxAge: ageMax }
          }

          // 距离偏好：直接使用字符串编码
          if (existingData.distanceRequirement) {
            this.formData.distanceRequirement = existingData.distanceRequirement
          }

          // 关系模式 & 沟通期望：直接使用字符串编码
          if (existingData.preferredRelationshipMode) {
            this.formData.preferredRelationshipMode = existingData.preferredRelationshipMode
          } else if (existingData.relationshipModeId) {
            // 兼容旧字段
            const id = existingData.relationshipModeId
            const map = { 1: 'high_frequency', 2: 'deep_communication', 3: 'casual_companion', 4: 'interest_buddy' }
            this.formData.preferredRelationshipMode = map[id] || ''
          }

          if (existingData.communicationExpectation) {
            this.formData.communicationExpectation = existingData.communicationExpectation
          } else if (existingData.communicationExpectationId) {
            const id = existingData.communicationExpectationId
            const map = { 1: 'instant_reply', 2: 'casual_reply', 3: 'timely_communication' }
            this.formData.communicationExpectation = map[id] || ''
          }

          // 关系品质 / 必须维度 / 优先维度：直接使用编码数组
          if (Array.isArray(existingData.relationshipQualities)) {
            this.formData.relationshipQualities = existingData.relationshipQualities
          }
          if (Array.isArray(existingData.mustHaveQualities)) {
            this.formData.mustHaveQualities = existingData.mustHaveQualities
          }
          if (Array.isArray(existingData.priorityQualities)) {
            this.formData.priorityQualities = existingData.priorityQualities
          }

          if (existingData.additionalRequirements) {
            this.formData.additionalRequirements = existingData.additionalRequirements
          }
        }
      } catch (error) {
        // 如果获取失败（比如404），说明用户还没有填写过问卷，这是正常的
        // 只在非404错误时记录
        if (error.response?.status !== 404) {
          console.warn('获取已有问卷数据失败:', error)
        }
      } finally {
        this.isLoading = false
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
  },
  mounted() {
    // 页面加载时尝试获取已有的问卷数据
    this.loadExistingQuestionnaire()
  },

  watch: {
    // 监控表单数据变化，触发自动保存
    formData: {
      handler() {
        // 只在组件已加载且用户已登录时进行自动保存
        const authStore = useAuthStore()
        if (!this.isLoading && authStore.isAuthenticated) {
          this.debounceAutoSave()
        }
      },
      deep: true,
      immediate: false
    }
  },
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
