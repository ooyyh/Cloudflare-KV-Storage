import { Hono } from 'hono';

export interface Env {
	kvPan: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();
app.get('/getAllFilesInfo', async (c) => {
    const kv = c.env.kvPan;

    if (!kv) {
        console.error('kvPan binding is undefined');
        return c.json({ error: 'Internal Server Error' }, 500);
    }

    try {
        // 从 KVNamespace 中获取 allFiles 的字符串值
        const allFilesString = await kv.get('allFiles');

        // 如果 allFiles 不存在，返回空数组
        if (!allFilesString) {
            return c.json({ code: '200', data: [] });
        }

        // 将字符串解析为 JSON 数组
        const allFiles = JSON.parse(allFilesString);

        // 返回解析后的 JSON 数组
        return c.json({ code: '200', data: allFiles });
    } catch (error) {
        console.error('Error retrieving files:', error);
        return c.json({ error: 'Failed to retrieve files' }, 500);
    }
});


app.post('/upload', async (c) => {
	// 从请求体中提取 name、data 和 size
	const { name, size, data } = await c.req.json();
	const kv = c.env.kvPan;

	if (!kv) {
		console.error('kvPan binding is undefined');
		return c.json({ error: 'Internal Server Error' }, 500);
	}

	console.log('Received file:', { name, size });

	try {
		// 获取 allFiles 的值
		const allFilesString = await kv.get('allFiles');

		// 将 allFiles 转换为 JSON 数组，如果不存在则初始化为空数组
		let allFiles: { name: string; size: number }[] = [];
		if (allFilesString) {
			allFiles = JSON.parse(allFilesString);
		}

		// 添加新文件信息到数组
		allFiles.push({ name, size });

		// 将更新后的数组保存回 KVNamespace
		await kv.put('allFiles', JSON.stringify(allFiles));

		// 将文件数据存储到 KVNamespace 中
		await kv.put(name, data);

		// 返回成功响应，包含上传文件的信息
		return c.json({
			code: '200',
			data: { name, size },
			message: 'File uploaded successfully',
		});
	} catch (error) {
		console.error('Error uploading file:', error);
		return c.json({ error: 'Failed to upload file' }, 500);
	}
});

export default app;
