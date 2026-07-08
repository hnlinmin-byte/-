<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Morning Vibes Generator

一个适合部署到云端的早安正能量文案生成器。

## 功能

- 生成中文或英文早安文案
- 支持多种心情/风格
- 支持背景主题、字体颜色、遮罩浓度调整
- 支持复制、保存图片、分享
- Gemini API Key 通过云端环境变量读取，不暴露在浏览器端

## 本地运行

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Create `.env.local` and add your Gemini API key:
   `GEMINI_API_KEY=your_key_here`
3. Run the app:
   `npm run dev`

## 部署到 Vercel

1. 登录 https://vercel.com
2. 点击 `Add New` -> `Project`
3. 导入这个 GitHub 仓库
4. Framework Preset 选择 `Vite`
5. 在 Environment Variables 添加：
   - Name: `GEMINI_API_KEY`
   - Value: 你的 Gemini API Key
6. 点击 `Deploy`

部署成功后，前端会调用 `/api/generate`，由 Vercel 云函数在服务端调用 Gemini。

## 注意

- 不要把 `.env.local` 上传到 GitHub。
- 不要把 API Key 写在前端代码里。
- 云端部署不会让 token 无限，仍然会消耗 Gemini API 配额。
