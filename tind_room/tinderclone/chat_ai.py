import os
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path
import json
import time
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

def chat_ai_response(msg_history, new_msg, ai_profile):
    client = OpenAI(
         api_key=os.getenv('OPENAI_API_KEY')
     )
    ai_id = ai_profile.pk
    name = ai_profile.name
    bio = ai_profile.bio
    goal = ai_profile.goal
    previous_messages = ""

    for message in msg_history:
        if message['sender'] == ai_id:
           previous_messages += f"{name}: {message['content']}\n"
        else:
            previous_messages += f"User: {message['content']}\n"
    time.sleep(3)

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"You are {name} and you're respoding to messages on a platform for finding roommates"
                                          f"you are looking for {goal} and this is your bio: {bio}"
                                          f"Respond to the users message the way {name} would respond to them."
            },
            {"role": "user", "content": "Previous messages : " + previous_messages},
            {"role": "user", "content": new_msg['content']}
        ],
         temperature = 1,
         max_tokens = 450,
    )

    response_msg = completion.choices[0].message.content
    print(response_msg)

    return response_msg