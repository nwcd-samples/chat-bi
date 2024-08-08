import { NextApiRequest, NextApiResponse } from 'next';

import { BedrockError, GetServiceResult } from '@/utils/server';
import { http } from '@/utils/app/api';

import { ChatBody } from '@/types/chat';

import { v4 as uuidv4 } from 'uuid';

interface Result {
  [key: string]: any;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { messages, userId, modelType, modelId } =
      req.body as unknown as ChatBody;
    const requestId = uuidv4();
    console.log('requestId >>> ', requestId);
    console.log('userId >>> ', userId);
    // if (!userId) {
    //   res.status(401);
    //   return;
    // }
    console.log('messages >>> ', messages);
    console.log('modelType >>> ', modelType);
    console.log('modelId >>> ', modelId);

    // const _result = await GetServiceResult(
    //   messages,
    //   modelType,
    //   modelId,
    //   requestId,
    // );
    // 
    const headers = {
      'X-Trace-Id': requestId,
      'Content-Type': 'application/json'
    };
    const response = await http.post("/queryllm?modelType=modelType", messages, { headers });
    console.log('answer data >>> ', response.data);
    res.status(200).json(response.data);

  } catch (error) {
    console.error(error);
    if (error instanceof BedrockError) {
      res.status(500).json({ status: 500, statusText: error.message });
    } else {
      res.status(500).json({ status: 500 });
    }
  }
};

export default handler;