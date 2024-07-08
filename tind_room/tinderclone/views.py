import os

from django.http import JsonResponse, FileResponse
from rest_framework.views import APIView
from rest_framework.decorators import authentication_classes, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from .serializers import ProfileSerializer
from .models import User, Profile, ImageMedia, Conversation
from rest_framework.parsers import MultiPartParser, FormParser
import datetime
import time
from django.db.models import Q
from .chat_ai import chat_ai_response

@parser_classes([MultiPartParser, FormParser])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class UserView(APIView):
    def get(self, request):
        user = request.user
        user_obj = User.objects.get(email=user)
        if user_obj.profile_created:
            birthdate = user_obj.profile.birthdate
            todays_date = datetime.date.today()
            age = todays_date.year - birthdate.year - ((todays_date.month, todays_date.day) < (birthdate.month, birthdate.day))
            matches = []
            matches_query = Profile.objects.filter(pk__in=user_obj.profile.matches)

            for i in matches_query:
                birthdate = i.birthdate
                todays_date = datetime.date.today()
                age = todays_date.year - birthdate.year - ((todays_date.month, todays_date.day) < (birthdate.month, birthdate.day))
                conversation = Conversation.objects.filter(Q(profile_1=user_obj.profile, profile_2=i) | Q(profile_1=i, profile_2=user_obj.profile))
                print('conversation')
                print(conversation)
                if(conversation):
                    has_conversation = conversation[0].pk
                else:
                    has_conversation = False
                matches.append({
                    "name": i.name,
                    "bio": i.bio,
                    "goal": i.goal,
                    "age": age,
                    "gender": i.gender,
                    "images": i.images,
                    "has_conversation" : has_conversation,
                    "is_ai" : i.ai_user,
                    "id": i.pk,
                })


            user_conversations = Conversation.objects.filter(Q(profile_1=user_obj.profile) | Q(profile_2=user_obj.profile))
            conversations = []
            for conversation in user_conversations:
                if conversation.profile_1.pk == user_obj.profile.pk:
                    print(conversation.messages[-1])
                    conv = {
                        "id": conversation.pk,
                        "user_id": conversation.profile_2.pk,
                        "last_message": conversation.messages[-1],
                        "last_message_timestamp" : conversation.messages[-1]['timestamp']
                    }
                else:
                    conv = {
                        "id": conversation.pk,
                        "user_id": conversation.profile_1.pk,
                        "user_name": conversation.profile_1.name,
                        "last_message": conversation.messages[-1],
                    }
                conversations.append(conv)

            conversations.sort(key=lambda x: x['last_message_timestamp'], reverse=True)

            profile_data = {
                "pk" : user_obj.profile.pk,
                "name": user_obj.profile.name,
                "bio": user_obj.profile.bio,
                "goal": user_obj.profile.goal,
                "gender": user_obj.profile.gender,
                "images": user_obj.profile.images,
                "matches": matches,
                "new_matches": user_obj.profile.new_matches,
                "liked": user_obj.profile.liked,
                "conversations": conversations,
                "birthdate": birthdate,
                "age": age,
            }
            response = {
                "profile_created": True,
                "profile_data": profile_data,
            }
        else:

            response = {"profile_created": False}
        return JsonResponse(response)



    def post(self, request):
        # create user profile
        pass

    def patch(self, request):
        pass

    def delete(self, request):
        pass


@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class SwipeView(APIView):
    def get(self, request):
        user = request.user
        user_obj = User.objects.get(email=user)
        profile = user_obj.profile
        excluded_profiles = profile.matches
        excluded_profiles.append(profile.pk)

        profile_query = Profile.objects.exclude(pk__in=excluded_profiles)

        swipe_cards = []

        for x, i in enumerate(profile_query):
            birthdate = i.birthdate
            todays_date = datetime.date.today()
            age = todays_date.year - birthdate.year - ((todays_date.month, todays_date.day) < (birthdate.month, birthdate.day))
            is_match = False
            if profile.pk in i.liked:
                is_match = True
            swipe_cards.append({
                "name": i.name,
                "bio": i.bio,
                "goal": i.goal,
                "age": age,
                "gender": i.gender,
                "images": i.images,
                "is_match": is_match,
                "id": i.pk,
            })

        return JsonResponse({"cards": swipe_cards})

    def post(self, request):
        print('swipe right')
        user = request.user
        liked_user = request.data['liked']
        match = request.data['match']
        user_obj = User.objects.get(email=user)
        # if liked_user in user_obj.profile.liked:
        #     return JsonResponse({"res": 'ok'})
        # print('liked user not yet in liked list')
        if match:
            user_obj.profile.liked.append(liked_user)
            user_obj.profile.matches.append(liked_user)
            user_obj.profile.new_matches.append(liked_user)

            match = Profile.objects.get(pk=liked_user)
            match.matches.append(user_obj.profile.pk)
            match.new_matches.append(user_obj.profile.pk)

            match.save(update_fields=['matches', 'new_matches'])
            user_obj.profile.save(update_fields=['matches', 'liked', 'new_matches'])

        else:
            user_obj.profile.liked.append(liked_user)
            user_obj.profile.save(update_fields=['liked'])

        return JsonResponse({"res": 'ok'})

    def delete(self, request):
        user = request.user
        data = request.data
        user_obj = User.objects.get(email=user)
        profile = user_obj.profile

        unmatch_pk = data['unmatched']
        unmatch_profile = Profile.objects.get(pk=unmatch_pk)
        print('unmatch pk:', unmatch_profile.pk)
        print('unmatch name', unmatch_profile.name)
        profile.matches.remove(unmatch_pk)
        profile.new_matches.remove(unmatch_pk)
        profile.liked.remove(unmatch_pk)

        unmatch_profile.matches.remove(profile.pk)
        unmatch_profile.new_matches.remove(profile.pk)
        unmatch_profile.liked.remove(profile.pk)

        conversation = Conversation.objects.filter(
            Q(profile_1=profile, profile_2=unmatch_profile) | Q(profile_1=unmatch_profile, profile_2=profile))
        if conversation:
            print('conversation found')
            print(conversation[0])
            conversation[0].delete()
        profile.save(update_fields=['matches', 'new_matches', 'liked'])
        unmatch_profile.save(update_fields=['matches', 'new_matches', 'liked'])

        return JsonResponse({"res": 'ok'})


@parser_classes([MultiPartParser, FormParser])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class ProfileView(APIView):
    def get(self, request):
        pass

    def post(self, request):
        # create user profile
        user = request.user
        data = request.data
        user_obj = User.objects.get(email=user)


        image_file = data['file']
        bio = data['bio']
        goal = data['goal']
        gender = data['gender']
        name = data['name']
        birthdate = data['birthdate']
        image_obj = ImageMedia.objects.create(user=user_obj, image=image_file)
        image_obj.save()
        image_id = image_obj.pk

        profile = Profile.objects.create(user=user_obj, images=[image_id,], bio=bio, name=name, birthdate=birthdate, goal=goal, gender=gender)
        profile.save()
        user_obj.profile_created = True
        user_obj.save()
        response = {"profile_id": 'ok'}
        return JsonResponse(response)

    def patch(self, request):
        user = request.user
        data = request.data
        user_obj = User.objects.get(email=user)
        profile = user_obj.profile

        if 'add_img' in data:
            image_file = data['add_img']
            image_obj = ImageMedia.objects.create(user=user_obj, image=image_file)
            image_obj.save()
            image_id = image_obj.pk
            profile.images.append(image_id)
            profile.save(update_fields=['images'])

        if 'remove_img' in data:
            image_id = int(data['remove_img'])
            profile.images.remove(image_id)
            profile.save(update_fields=['images'])

        if 'edit_info' in data:
            profile.bio = data['bio']
            profile.birthdate = data['birthdate']
            profile.gender = data['gender']
            profile.goal = data['goal']
            profile.save(update_fields=['bio', 'birthdate', 'gender', 'goal'])

        response = {"res": 'ok'}
        return JsonResponse(response)


    def delete(self, request):
        pass


@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class ConversationView(APIView):
    def get(self, request):
        conversation_id = request.query_params['conversation_id']
        conversation = Conversation.objects.get(pk=conversation_id)
        messages = conversation.messages
        return JsonResponse({"messages": messages})


    def post(self, request):
        user = request.user
        data = request.data
        user_2 = data['user_2']
        message = data['message']
        print(message)
        timestamp = time.time()
        message['timestamp'] = timestamp
        user_obj = User.objects.get(email=user)
        profile_sender = user_obj.profile
        profile_receiver = Profile.objects.get(pk=user_2)

        conversation = Conversation.objects.create(profile_1=profile_sender, profile_2=profile_receiver)
        conversation_id = conversation.pk
        conversation.messages.append(message)
        if 'ai_user' in data:

            ai_response = chat_ai_response(conversation.messages, message, profile_receiver)
            timestamp = time.time()
            ai_message = {
                'sender': profile_receiver.pk,
                'content': ai_response,
                'timestamp': timestamp,
            }

            conversation.messages.append(ai_message)
            conversation.save()
            return JsonResponse({"conversation_id": conversation_id, "response": ai_message})

        else:

            conversation.save()
            response = {'conversation_id':conversation_id}
            return JsonResponse(response)


    def patch(self, request):
        user = request.user
        user_obj = User.objects.get(email=user)
        user_profile = user_obj.profile
        data = request.data
        conversation_id = data['conversation_id']
        message = data['message']
        timestamp = time.time()
        message['timestamp'] = timestamp

        print(timestamp)
        conversation = Conversation.objects.get(pk=conversation_id)

        if 'ai_user' in data:
            if user_profile == conversation.profile_1:
                ai_profile = conversation.profile_2
            else:
                ai_profile = conversation.profile_1

            ai_response = chat_ai_response(conversation.messages, message, ai_profile)
            timestamp = time.time()
            ai_message = {
                'sender': ai_profile.pk,
                'content': ai_response,
                'timestamp': timestamp,
            }
            conversation.messages.append(message)
            conversation.messages.append(ai_message)
            conversation.save(update_fields=['messages'])
            return JsonResponse({"response": ai_message})

        else:
            conversation.messages.append(message)
            conversation.save(update_fields=['messages'])


            return JsonResponse({"response": 'ok'})


    def delete(self, request):
        pass

class GetMediaFile(APIView):
    def get(self, request):
        params = request.query_params
        media_id = params['media_id']
        media_instance = ImageMedia.objects.get(pk=media_id)
        file_path = media_instance.image.path
        response = FileResponse(open(file_path, 'rb'), as_attachment=True)
        return response