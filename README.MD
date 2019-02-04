# Requestool  
## What's Requestool?
A simple, easy but strong fake-request chrome extension.  
v 1.00  
Created just for fun!
## How to use?
1. Open workpage(background.html)
   > Right-click menu or popup(click Requestool's icon) will help.
2. Open your target page in a new tab.
3. ctrl + shift + I or F12 & click the 'RequestTool' tab.
4. click 'begin listen' and do operate in the page.
5. Choose your target REQUEST in devpage's list.
6. Switch to workpage. Now you can do what you want to the caught REQUEST.
   > - you can adjust _repeat_ and _timeInterval_ for every REQUEST;  
   > - you can use _successCheck(optinal)_ & _failCheck(optinal)_ to decide when one task should be stopped.  
   > for example:  
   > you have a request. when response has 
   > ``` json
   > {
   >    "flag": "1",
   >    "others": "i dont care",
   > }
   > ```
   > You'll konw it's time to stop it.  
   > Now set _successCheck(optinal)_ as `{"flag": "1"}`of a stantard JSON. You'll get what you want.  
   > Also support multi-condition.

# Contact Me
wyzlshx@qq.com