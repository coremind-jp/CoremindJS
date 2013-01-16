cm.Class.create(
{
    /** @name cm.display */
    $name:"cm.math.Matrix2D",
    $singleton:true,
    $define:
    /** @lends cm.math.Matrix2D.prototype */
    {
        Matrix2D:function() {},
        destroy:function() {},
        
        createIdentity:function()
        {
            return [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            ];
        },
        
        createScale:function(x, y)
        {
            return [
                x, 0, 0,
                0, y, 0,
                0, 0, 1
            ];
        },
        
        createTranslate:function(x, y)
        {
            return [
                0, 0, x,
                0, 0, y,
                0, 0, 1
            ];
        },
        
        createRotate:function(sin, cos)
        {
            return [
                cos, -sin, 0,
                sin,  cos, 0,
                  0,    0, 1
            ];
        },
        
        multiple:function()
        {
            var
                _result = arguments[0],
                a = null,
                b = null;
                
            for (var i = 1, len = arguments.length; i < len; i++)
            {
                a = _result;
                b = arguments[i];
                
                _resilt = cm.object.clone(_result, []);
                _result[0] = a[0] * b[0] + a[1] * b[3],// + 0,//11
                _result[1] = a[0] * b[1] + a[1] * b[4],// + 0,//12
                _result[2] = a[0] * b[2] + a[1] * b[5] + a[2],//13
                
                _result[3] = a[3] * b[0] + a[4] * b[3],// + 0,//21
                _result[4] = a[3] * b[1] + a[4] * b[4],// + 0,//22
                _result[5] = a[3] * b[2] + a[4] * b[5] + a[5],//23
                
                _result[6] = a[6] * b[0] + a[7] * b[3],// + 0,//31
                _result[7] = a[6] * b[1] + a[7] * b[4],// + 0,//31
                _result[8] = a[6] * b[2] + a[7] * b[5] + a[8] //33
            };
            return _result;
        }
    }
});