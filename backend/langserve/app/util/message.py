

from langchain_core.messages.human import HumanMessage

  
def img_message(base64_images: list[str], text: str):
    """
    用于图像分析的GPT-4V消息。

    :param base64_images: 图像列表。
    :param text: 文本提示。
    :return: 包含每个图像和文本提示的消息对象列表。
    @version 240603
    """
    messages = []
    text_message = {
        "type": "text",
        "text": text,
    }
    messages.append(text_message)
    if base64_images:
        for image in base64_images:
            image_message = {
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{image}"},
            }
            messages.append(image_message)
    return [HumanMessage(content=messages)]

