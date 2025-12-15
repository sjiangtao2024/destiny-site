# 知命达理容易斋 - CMS 后台配置与使用指南

本文档用于指导管理员配置网站的内容管理后台（CMS），并协助内容创作者（最终用户）上手使用。

## 1. 系统简介
本网站采用 **Git-based CMS** 架构。
*   **对于访问者**：看到的是高性能的静态网页。
*   **对于创作者**：拥有一个可视化的 `/admin` 后台，像写公众号一样发布文章。
*   **核心机制**：后台的操作会自动触发 GitHub 代码提交，进而触发 Cloudflare Pages 自动构建更新。

---

## 2. 管理员配置指南 (一次性设置)

在正式使用前，需要配置 GitHub 与 Cloudflare 之间的身份认证通道。

### 第一步：创建 GitHub OAuth App
1.  登录您的 GitHub 账号。
2.  访问 **Settings** -> **Developer settings** -> [OAuth Apps](https://github.com/settings/developers)。
3.  点击右上角的 **New OAuth App**。
4.  填写如下信息（请严格按照下表填写）：
    *   **Application Name**: `知命达理CMS` (可自定义)
    *   **Homepage URL**: `https://rongyizhai.de5.net`
    *   **Authorization callback URL**: `https://rongyizhai.de5.net/oauth/callback`  ⚠️(重要：必须完全一致)
5.  点击 **Register application**。
6.  在生成页面中，记录下 **Client ID**。
7.  点击 **Generate a new client secret**，记录下 **Client Secret**。
8.  将 **Client ID** 和 **Client Secret** 填入本地敏感信息文件：`docs/SENSITIVE_INFO.md`（该文件已加入 `.gitignore`，不会提交到仓库）。

### 第二步：配置 Cloudflare 环境变量
1.  登录 Cloudflare Dashboard。
2.  进入 **Workers & Pages** -> 选择本项目 (`destiny-site`)。
3.  点击顶部标签栏的 **Settings** -> **Environment variables**。
4.  点击 **Add variable**，添加以下两个变量（**Production** 和 **Preview** 环境建议都加上）：
    *   变量名: `GITHUB_CLIENT_ID` / 值: (填入第一步获取的 ID)
    *   变量名: `GITHUB_CLIENT_SECRET` / 值: (填入第一步获取的 Secret)
5.  保存设置。
6.  **重要**：进入 **Deployments** 页面，点击最近一次部署右侧的三个点 -> **Retry deployment**，或者推送一次新代码。**必须重新部署一次，环境变量才会生效。**

---

## 3. 用户使用指南 (交付给创作者)

### 准备工作
*   请确保您拥有一个 **GitHub 账号**（免费注册即可）。
*   请联系管理员，确保您的 GitHub 账号已被添加为项目的 **Collaborator**（协作者）。

### 如何发布/修改文章
1.  **登录后台**
    *   在浏览器访问：[https://rongyizhai.de5.net/admin](https://rongyizhai.de5.net/admin)
    *   点击页面中间的 **Login with GitHub** 按钮。
    *   在弹出的窗口中点击 **Authorize** 确认授权。

2.  **管理文章**
    *   进入后台后，您会看到左侧的 **Collections** 栏目，点击 **文章**。
    *   **新建文章**：点击右上角的蓝色 **New 文章** 按钮。
    *   **修改文章**：在列表中点击任意标题即可进入编辑模式。

3.  **编辑内容**
    *   **标题**：输入文章大标题。
    *   **发布日期**：选择日期（这决定了文章排序）。
    *   **分类**：从下拉菜单选择（如“易学入门”、“读易明理”等）。
    *   **封面图**：点击“Choose Image”上传本地图片。
    *   **正文**：
        *   直接在富文本框中输入内容。
        *   可以使用顶部的工具栏进行 **加粗**、*列表*、[链接] 等排版。
        *   插入图片：点击工具栏的 `+` 号 -> Image。

4.  **发布上线**
    *   编辑完成后，点击顶部的 **Publish** 按钮。
    *   选择 **Publish now**。
    *   系统会自动保存并开始构建网站。**通常等待 1-2 分钟后**，刷新网站首页即可看到更新。

### 常见问题
*   **图片上传失败？** 尽量上传小于 2MB 的 JPG/PNG 图片。
*   **发布后没变化？** Cloudflare 构建需要时间，请稍等几分钟。如果 10 分钟后仍未更新，请联系管理员检查构建日志。
