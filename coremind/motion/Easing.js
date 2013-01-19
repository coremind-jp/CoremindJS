cm.Class.create(
    "cm.motion.easingOption.BackOption",
    "cm.motion.easingOption.BounceOption",
    "cm.motion.easingOption.ElasticOption",
{
    $name:"cm.motion.Easing",
    $singleton:true,
    $define:{
        Easing:function(){},
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
            if (cm.equal.isUndefined(option)) option = cm.motion.easingOption.BackOption;
            return ((option.skew + 1) * p - option.skew) * option.baseEase(p);
        },
        BackOut:function(p, option)
        {
            if (cm.equal.isUndefined(option)) option = cm.motion.easingOption.BackOption;
            return -(((option.skew + 1) * (p = 1-p) - option.skew) * option.baseEase(p)) + 1;
        },
        BackInOut:function(p, option) {
            return p < .5 ?
                cm.motion.Easing.BackIn(p * 2, option) * .5:
                cm.motion.Easing.BackOut((p - .5) * 2, option) * .5 + .5;
        },
        /** Elastic */
        ElasticIn:function(p, option)
        {
            if (cm.equal.isUndefined(option)) option = cm.motion.easingOption.ElasticOption;
            var _pi = Math.PI;
            return option.baseEase(p) * -Math.cos(_pi + (_pi * 2) * option.amplitude * p);
        },
        ElasticOut:function(p, option)
        {
            if (cm.equal.isUndefined(option)) option = cm.motion.easingOption.ElasticOption;
            var _pi = Math.PI;
            return option.baseEase(1-p) * Math.cos(_pi + (_pi * 2) * option.amplitude * p) + 1;
        },
        ElasticInOut:function(p, option) {
            return p < .5 ?
                cm.motion.Easing.ElasticIn(p * 2, option) * .5:
                cm.motion.Easing.ElasticOut((p - .5) * 2, option) * .5 + .5;
        },
        /** Bounce */
        BounceIn:function(p, option)
        {
            if (cm.equal.isUndefined(option)) option = cm.motion.easingOption.BounceOption;
            
            var _bounceTable = [1];
            for (var i = 0; i < option.bounceNum + 1; i++) 
                for (var j = 1; j <= i; j++) 
                    _bounceTable[i] = _bounceTable[i - 1] << 1;
                    
            var _totalBounceSegment = 0;
            for (i = 0; i <= option.bounceNum; i++) 
                _totalBounceSegment += _bounceTable[i];
            _totalBounceSegment -= _bounceTable[i-2];
            
            var _segmentPer = p / (1 / _totalBounceSegment);
            
            var _offsetBounceSegment = _currentBounceNum = 0;
            for (i = 0; i <= option.bounceNum; i++)
            {
                var _threshold = _offsetBounceSegment + _bounceTable[i];
                if (_segmentPer < _threshold)
                {
                    _currentBounceNum = i;
                    break;
                }
                _offsetBounceSegment = _threshold;
            }
            
            var _reflection = 1;
            j = option.bounceNum - (_currentBounceNum);
            for (i = 0; i < j; i++) _reflection *= option.reflection;
                
            return Math.sin(Math.PI * (_segmentPer - _offsetBounceSegment) / _bounceTable[_currentBounceNum]) * _reflection;
        },
        BounceOut:function(p, option)
        {
            if (cm.equal.isUndefined(option)) option = cm.motion.easingOption.BounceOption;
            
            var _bounceTable = [1];
            for (var i = 0; i < option.bounceNum + 1; i++) 
                for (var j = 1; j <= i; j++) 
                    _bounceTable[i] = _bounceTable[i - 1] << 1;
                    
            var _totalBounceSegment = 0;
            for (i = 0; i <= option.bounceNum; i++) 
                _totalBounceSegment += _bounceTable[i];
            _totalBounceSegment -= _bounceTable[i-2];
            
            var _segmentPer = (p = 1 - p) / (1 / _totalBounceSegment);
            
            var _offsetBounceSegment = _currentBounceNum = 0;
            for (i = 0; i <= option.bounceNum; i++)
            {
                var _threshold = _offsetBounceSegment + _bounceTable[i];
                if (_segmentPer < _threshold)
                {
                    _currentBounceNum = i;
                    break;
                }
                _offsetBounceSegment = _threshold;
            }
            
            var _reflection = 1;
            j = option.bounceNum - (_currentBounceNum);
            for (i = 0; i < j; i++) _reflection *= option.reflection;
                
            return 1-Math.sin(Math.PI * (_segmentPer - _offsetBounceSegment) / _bounceTable[_currentBounceNum]) * _reflection;
        },
        BounceInOut:function(p, option) { 
            return p < .5 ?
                cm.motion.Easing.BounceIn(p * 2, option) * .5:
                cm.motion.Easing.BounceOut((p - .5) * 2, option) * .5 + .5;
        }
    }
});