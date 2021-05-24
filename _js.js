function _curry(fn){
    return function(a,b){
        // 인자가 2개일 경우 fn(a,b) 바로 return
        return arguments.length == 2 ? fn(a,b) : function(b) { return fn(a,b);};
    }
}

function _curryr(fn){
    return function(a,b){
        return arguments.length == 2 ? fn(a,b) : function(b) { return fn(b,a);}
    }
}

var _get = _curryr(
    function _get(obj, key){
        return obj == null ? undefined : obj[key];
});

function _filter(list, predi){
    var new_list = [];
    _each(list, function(val){
        if(predi(val)){
            new_list.push(val);
        }
    })
    return new_list;
}

function _map(list, mapper){
    var new_list = [];
    _each(list, function(val){
        new_list.push(mapper(val))
    });
    return new_list;
}

function _each(list, iter){
    for(let i = 0 ; i<list.length;i++){
        iter(list[i]);
    }
    return list;
}

var _map = _curryr(_map),
    _filter = _curryr(_filter);

var slice = Array.prototype.slice;
function _rest(list,num){
    return slice.call(list,num || 1);
}

function _reduce(list,iter,meno){
    if(arguments.length == 2){
        meno = list[0];
        list = _rest(list);
    }
    _each(list,function(val){
        meno = iter(meno, val);
    });
    return meno;
}

function _pipe(){
    var fns = arguments;
    return function(arg){
        return _reduce(fns, function(arg, fn){
            return fn(arg);
        }, arg)
    }
}

function _go(arg){
    var fns = _rest(arguments);
    return _pipe.apply(null, fns)(arg);
}




    