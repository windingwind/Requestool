# Requestool  
## What is Requestool?

![GitHub](https://img.shields.io/github/license/windingwind/Requestool)

A simple, easy-to-use and powerful analog request chrome extension.  
v 1.0.1  
> PLEASE DO NOT USE IT FOR ILLEGAL PURPOSES!
## Guide to use
1. Open workpage(background.html)
   > Right-click menu or popup(click Requestool's icon).
2. Open your target page in a new tab.
3. Press `F12` to open Chrome DevTools and click the `RequestTool` tab.
4. Click `start listening` and send your REQUEST in current page.
5. Now turn to the list of requests in `RequestTool` tab. Select your target REQUEST, which is usually a POST.
6. Switch to workpage opened before. Now you can see the caught REQUEST in list.
   > Adjust _repeat_ and _timeInterval_ for every REQUEST;  
   > - Use _successCheck(optinal)_ & _failCheck(optinal)_ to decide when one task should be stopped.  
   > for example:  
   > you have a request responses like this: 
   > ``` json
   > {
   >    "flag": "1",
   >    "otherPara": "i dont care",
   > }
   > ```
   > - If your want to stop REQUEST when `flag=1`, 
    set _successCheck(optinal)_ to `{"flag": "1"}`of a stantard JSON.  
   > - Support multi-condition.(not tested)

# Version

- v 1.0.1 2019.09.17 add LICENCE modify README
- v 1.0.0 initial version

# Contributor
* **nowaku** - *Initial work* - [windingwind](https://github.com/windingwind)

# Contact Me
wyzlshx@foxmail.com