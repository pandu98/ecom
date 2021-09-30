from django.shortcuts import render
# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django.http import HttpResponse,JsonResponse
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login,logout
from django.contrib.auth.decorators import login_required

import braintree



gateway = braintree.BraintreeGateway(
    braintree.Configuration(
        braintree.Environment.Sandbox,
        merchant_id="4s3xnwx2mk5gn6cv",
        public_key="vnkp4h9b49bywc6d",
        private_key="8f786d950a3251cf91c0ac9b6015bfeb"
    )
)



def validate_user_session(id,token):
    UserModel=get_user_model()
    try:
        user=UserModel.objects.get(pk=id)
        if user.session_token==token:
            return True
        return False
    except UserModel.DoesNotExist:
        return False  



@csrf_exempt
def generate_token(request,id,token):
    if not validate_user_session(id,token):
        return JsonResponse({'error':'Invalid session , login again'})
    return JsonResponse({'clientToken':gateway.client_token.generate(),'success':True})



@csrf_exempt
def process_payment(request,id,token):
    if not validate_user_session(id,token):
        return JsonResponse({'error':'Invalid session , login again'})
    nonce_from_the_client=request.POST["paymentMethodNonce"]
    amount_from_the_client=request.POST["amount"]

    result=gateway.transaction.sale({
        "amount":amount_from_the_client,
        "payment_method_nonce":nonce_from_the_client,
        "options":
        {
            "submit_for_settlement":True
        }
    })

    if result.is_success:
        return JsonResponse({
            "success":result.is_success,
            'transaction':{'id':result.transaction.id,'amount':result.transaction.amount}
        })
    else:
        return JsonResponse({'error':True,'success':False})
