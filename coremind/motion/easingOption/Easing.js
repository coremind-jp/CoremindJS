cls.exports(
    "cm.motion.easingOption.BackOption",
    "cm.motion.easingOption.BounceOption",
    "cm.motion.easingOption.ElasticOption",
{
    $name:"cm.motion.Easing",
    $singleton:true,
    $define:{
        Easing:function()
        {
            this.DEFAULT_OPTION = {
                BACK:new cm.motion.easingOption.BackOption(),
                BOUNCE:new cm.motion.easingOption.BounceOption(),
                ELASTIC:new cm.motion.easingOption.ElasticOption()
            };
        },
        destroy:function(){},
        
        Linear: function (p) {
            return p;
        },
        /** Sine */
        SineIn: function (p) {
            return 1-Math.cos(Math.PI / 2 * p);
        },
        SineOut: function (p) {
            return Math.sin(Math.PI / 2 * p);
        },
        SineInOut:function (p) {
            return p < .5 ?
                cm.motion.Easing.SineIn(p * 2) * .5:
                cm.motion.Easing.SineOut((p - .5) * 2) * .5 + .5;
        },
        /** Quad */
        QuadIn: function (p) {
            return p*p;
        },
        QuadOut: function (p) {
            return 1-(p = 1-p)*p;
        },
        QuadInOut:function (p) {
            return p < .5 ?
                cm.motion.Easing.QuadIn(p * 2) * .5:
                cm.motion.Easing.QuadOut((p - .5) * 2) * .5 + .5;
        },
        /** Cubic */
        CubicIn: function (p) {
            return p*p*p;
        },
        CubicOut: function (p) {
            return 1-(p = 1-p)*p*p;
        },
        CubicInOut:function (p) {
            return p < .5 ?
                cm.motion.Easing.CubicIn(p * 2) * .5:
                cm.motion.Easing.CubicOut((p - .5) * 2) * .5 + .5;
        },
        /** Quart */
        QuartIn: function (p) {
            return p*p*p*p;
        },
        QuartOut: function (p) {
            return 1-(p = 1-p)*p*p*p;
        },
        QuartInOut:function (p) {
            return p < .5 ?
                cm.motion.Easing.QuartIn(p * 2) * .5:
                cm.motion.Easing.QuartOut((p - .5) * 2) * .5 + .5;
        },
        /** Quint */
        QuintIn: function (p) {
            return p*p*p*p*p;
        },
        QuintOut: function (p) {
            return 1-(p = 1-p)*p*p*p*p;
        },
        QuintInOut:function (p) {
            return p < .5 ?
                cm.motion.Easing.QuintIn(p * 2) * .5:
                cm.motion.Easing.QuintOut((p - .5) * 2) * .5 + .5;
        },
        /** Expo */
        ExpoIn: function (p) {
            return p*p*p*p*p*p;
        },
        ExpoOut: function (p) {
            return 1-(p = 1-p)*p*p*p*p*p;
        },
        ExpoInOut:function (p) {
            return p < .5 ?
                cm.motion.Easing.ExpoIn(p * 2) * .5:
                cm.motion.Easing.ExpoOut((p - .5) * 2) * .5 + .5;
        },
        /** Back */
        BackIn:function(p, option)
        {
            if (eq.isUndefined(option)) option = cm.motion.Easing.DEFAULT_OPTION.BACK;
            var _baseEase = option.baseEase();
            var _skew = option.skew();
            return ((_skew + 1) * p - _skew) * _baseEase(p);
        },
        BackOut:function(p, option)
        {
            if (eq.isUndefined(option)) option = cm.motion.Easing.DEFAULT_OPTION.BACK;
            var _baseEase = option.baseEase();
            var _skew = option.skew();
            return -(((_skew + 1) * (p = 1-p) - _skew) * _baseEase(p)) + 1;
        },
        BackInOut:function(p, option) {
            return p < .5 ?
                cm.motion.Easing.BackIn(p * 2, option) * .5:
                cm.motion.Easing.BackOut((p - .5) * 2, option) * .5 + .5;
        },
        /** Elastic */
        ElasticIn:function(p, option)
        {
            if (eq.isUndefined(option)) option = cm.motion.Easing.DEFAULT_OPTION.ELASTIC;
            var _baseEase = option.baseEase();
            var _amplitude = option.amplitude();
            var _pi = Math.PI;
            return _baseEase(p) * -Math.cos(_pi + (_pi * 2) * _amplitude * p);
        },
        ElasticOut:function(p, option)
        {
            if (eq.isUndefined(option)) option = cm.motion.Easing.DEFAULT_OPTION.ELASTIC;
            var _baseEase = option.baseEase();
            var _amplitude = option.amplitude();
            var _pi = Math.PI;
            return _baseEase(1-p) * Math.cos(_pi + (_pi * 2) * _amplitude * p) + 1;
        },
        ElasticInOut:function(p, option) {
            return p < .5 ?
                cm.motion.Easing.ElasticIn(p * 2, option) * .5:
                cm.motion.Easing.ElasticOut((p - .5) * 2, option) * .5 + .5;
        },
        /** Bounce */
        BounceIn:function(p, option)
        {
            if (eq.isUndefined(option))
                option = cm.motion.Easing.DEFAULT_OPTION.BOUNCE;

            var _bounceTable = [1];
            var _num = option.bounceNum();
            var _refrection = option.reflection();

            for (var i = 0; i < _num + 1; i++) 
                for (var j = 1; j <= i; j++) 
                    _bounceTable[i] = _bounceTable[i - 1] << 1;
                    
            var _totalBounceSegment = 0;
            for (i = 0; i <= _num; i++) 
                _totalBounceSegment += _bounceTable[i];
            _totalBounceSegment -= _bounceTable[i-2];
            
            var _segmentPer = p / (1 / _totalBounceSegment);
            
            var _offsetBounceSegment = _currentBounceNum = 0;
            for (i = 0; i <= _num; i++)
            {
                var _threshold = _offsetBounceSegment + _bounceTable[i];
                if (_segmentPer < _threshold)
                {
                    _currentBounceNum = i;
                    break;
                }
                _offsetBounceSegment = _threshold;
            }
            
            var reflection = 1;
            j = _num - (_currentBounceNum);
            for (i = 0; i < j; i++) reflection *= _refrection;
                
            return Math.sin(Math.PI * (_segmentPer - _offsetBounceSegment) / _bounceTable[_currentBounceNum]) * reflection;
        },
        BounceOut:function(p, option)
        {
            if (eq.isUndefined(option))
                option = cm.motion.Easing.DEFAULT_OPTION.BOUNCE;
            
            var _bounceTable = [1];
            var _num = option.bounceNum();
            var _refrection = option.reflection();

            for (var i = 0; i < _num + 1; i++) 
                for (var j = 1; j <= i; j++) 
                    _bounceTable[i] = _bounceTable[i - 1] << 1;
                    
            var _totalBounceSegment = 0;
            for (i = 0; i <= _num; i++) 
                _totalBounceSegment += _bounceTable[i];
            _totalBounceSegment -= _bounceTable[i-2];
            
            var _segmentPer = (p = 1 - p) / (1 / _totalBounceSegment);
            
            var _offsetBounceSegment = _currentBounceNum = 0;
            for (i = 0; i <= _num; i++)
            {
                var _threshold = _offsetBounceSegment + _bounceTable[i];
                if (_segmentPer < _threshold)
                {
                    _currentBounceNum = i;
                    break;
                }
                _offsetBounceSegment = _threshold;
            }
            
            var reflection = 1;
            j = _num - (_currentBounceNum);
            for (i = 0; i < j; i++) reflection *= _refrection;
                
            return 1-Math.sin(Math.PI * (_segmentPer - _offsetBounceSegment) / _bounceTable[_currentBounceNum]) * reflection;
        },
        BounceInOut:function(p, option) { 
            return p < .5 ?
                cm.motion.Easing.BounceIn(p * 2, option) * .5:
                cm.motion.Easing.BounceOut((p - .5) * 2, option) * .5 + .5;
        }
    }
});