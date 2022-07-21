//在ES5中，没有提供直接在函数的参数列表中指定默认值的语法，要想为函数参数指定默认之，只能通过下面的模式来实现。

function makeRedirect(url, timeout)
{
    url = rul || "/home";
    timeout = timeout || 2000;

    //函数的其余部分
}

//在这个例子中，url和timeout是可选参数，如果不传入对应的参数值，它们也将被赋予一个默认值。
//但是这种模式设置函数的默认值有一个缺陷，如果形參timeout传入值0,即使这个值是合法的，也会被
//视为一个假值，并最终将timeout设置为2000.


//更安全的做法是通过typeof检查参数类型
function mRedirect(url, timeout)
{
    url = (typeof url != "undefined") ? url : "/home";
    timeout = (typeof timeout != "undefined") ? timeout : 2000;
    //函数其余部分
}

//ES6简化了形參提供默认值的过程，直接在参数列表中为形參指定默认值。
function m6Redirect(url = "/home", timeout = 2000)
{
    //函数其余部分
}
//调用m6Redirect()，则使用参数url和timeout的默认值;如果调用m6Redirect("/login"),则
//使用参数timeout的默认值;如果调用m6Redirect()时传入两个参数，则不使用默认值。

//此外，与其他编程语言要求具有默认值的参数只能在函数列表的最右边不同，在ES6中声明函数时，
//可以为任意参数指定值，在已指定值的参数后还可以继续声明无默认值的参数。

function m61Redirect(url = "/home", timeout = 2000, callback)
{
    //函数其余部分
}

//在这种情况下，只有在没有为url和timeout传值，或者主动为他们传入undefined时才会用它们的默认值
//////////////////////
//使用url和timeout的默认值
//makeRedirect();
//
//使用url和timeout的默认值
//makeRedirect(undifined, undifined, function(){});
//
//使用timeout的默认值
//makeRedirect("/login");
//
//不使用timeout的默认值
//makeRedirect("/login", null, function(){});