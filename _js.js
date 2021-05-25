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
    _each(list, function(val, key){
        new_list.push(mapper(val,key))
    });
    return new_list;
}

function _is_object(obj){
    return typeof obj == 'object' && !!obj;
}

function _keys(obj){
    return _is_object(obj) ? Object.keys(obj) : [];
}

var _length = _get('length');

function _each(list, iter){
    var keys = _keys(list);
    for(let i = 0, len = keys.length; i<len; i++){
        iter(list[keys[i]], keys[i]);
    }
    return list;
}

var _map = _curryr(_map),
    _filter = _curryr(_filter);

var _pairs = _map((key,val) => [key,val]);

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

var _values = _map(_identity);

function _identity(val){
    return val;
}

function _pluck(data,key){
    return _map(data, _get(key))
}
    
function _negate(func){
    return function(val){
        return !func(val);
    }
}

var _reject = _curryr(function(data,predi){
    return _filter(data, _negate(predi))
})

function _reject(data, predi){
    return _filter(data,_negate(predi));
}

var _compact = _filter(_identity);

var _find = _curryr(function(list, predi){
    var keys = _keys(list);
    for(let i = 0, len = keys.length; i<len; i++){
        var val = list[keys[i]];
        if(predi(val)) return val;
    }
});

var _find_index = _curryr(function(list, predi){
    var keys = _keys(list);
    for(let i = 0, len = keys.length; i<len; i++){
        var val = list[keys[i]];
        if(predi(val)) return i;
    }
    return -1;           
})

function _some(data, predi){
    return _find_index(data,predi || _identity) != -1;
}

function _every(data,predi){
    return _find_index(data, _negate(predi || _identity)) == -1;
}

function _min(data){
    return _reduce(data,function(a,b){
        return a < b ? a : b;
    })
}
function _max(data){
    return _reduce(data,function(a,b){
        return a > b ? a : b;
    })
}

var _min_by = _curryr(_min_by);
var _max_by = _curryr(_max_by);

function _min_by(data,iter){    // 절대값으로 값 비교
    return _reduce(data,function(a,b){
        return iter(a) < iter(b) ? a : b;
    })
} 

function _max_by(data,iter){    // 절대값으로 값 비교
    return _reduce(data,function(a,b){
        return iter(a) > iter(b) ? a : b;
    })
} 

function _push(obj, key, val){
    (obj[key] = obj[key] || []).push(val);
    return obj;
}

var _group_by = _curryr(function(data, iter){
    return _reduce(data, function(grouped, val){
        return _push(grouped, iter(val),val);
    }, {});
});

var _head = function(list){
    return list[0];
}

var _inc = function(count, key){
    count[key] ? count[key]++ : count[key] = 1;
    return count;
}

var _count_by = _curryr(function(data, iter){
    return _reduce(data, function(count, val){
        return _inc(count, iter(val));
    },{});
})