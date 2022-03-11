(function () {
    let wrap = document.querySelector(".wrap"),
        box = document.querySelector("ul#box"),
        aLi = box.children;
    let transformFn = [
        function Table() {           //  元素周期表布局
            //  Y轴 的中心坐标是 4
            //  X轴 的中心坐标是 8.5

            //  前十八个元素的坐标
            let coor = [
                { x: 0, y: 0 },
                { x: 17, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 12, y: 1 },
                { x: 13, y: 1 },
                { x: 14, y: 1 },
                { x: 15, y: 1 },
                { x: 16, y: 1 },
                { x: 17, y: 1 },
                { x: 0, y: 2 },
                { x: 1, y: 2 },
                { x: 12, y: 2 },
                { x: 13, y: 2 },
                { x: 14, y: 2 },
                { x: 15, y: 2 },
                { x: 16, y: 2 },
                { x: 17, y: 2 }
            ];
            //  计算元素的坐标
            [...aLi].forEach((n, i) => {
                let x, y;
                if (i <= 17) {
                    //  0~17个元素的坐标
                    x = coor[i].x;
                    y = coor[i].y;
                }
                else if (i <= 89) {
                    //  18~89个元素的坐标
                    x = i % 18;
                    y = (i / 18 | 0) + 2;
                }
                else if (i <= 119) {
                    //  90~119个元素的坐标
                    x = (i - 90) % 15 + 1.5;
                    y = (i / 15 | 0) + 1;
                }
                else {
                    //  剩下元素固定坐标
                    x = 17;
                    y = 6;
                }
                let tX = (x - 8.5) * 150,
                    tY = (y - 4) * 190;
                n.style.transform = `translateX(${tX}px) translateY(${tY}px)`;
            });
        },
        function Sphere() {          //  球状 布局
            let arr = [1, 4, 7, 9, 13, 16, 20, 17, 14, 8, 7, 5, 3, 1];      //  定义每一个li的分布
            //  观察得出 rotateX 从 90~-90 180度变化量评分到arr.length 个维度上
            let x_ = 180 / (arr.length - 1);
            [...aLi].forEach((n, i) => {
                let { ceng, ge } = getPos(i);      //  根据 i 求出当前 li 在第几行第几个
                let rX = 90 - ceng * x_;        //  计算出每个 li 在 X轴和Y轴 的旋转角度
                let rY = 360 / arr[ceng] * (ge + 0.5);
                n.style.transform = `rotateY(${rY}deg) rotateX(${rX}deg) translateZ(1000px)`;
            });
            function getPos(i) {
                let sum = 0;
                for (let j = 0; j < arr.length; j++) {
                    sum += arr[j];      //  数组的当前项分布，相加，赋值给sum
                    if (sum > i) {
                        return { ceng: j, ge: arr[j] - (sum - i) };      //  返回当前 li 的层数和行数
                    }
                }
            }
        },
        function Helix() {           //  螺旋状布局
            [...aLi].forEach((n, i) => {
                let rY = i * (360 / (125 / 3.5)),     //  通过想要的圈数，计算角度
                    tY = (i - 125 / 2) * 10;          //  算出相邻的元素在 Y轴 上的间距
                n.style.transform = `rotateY(${rY}deg) translateY(${tY}px) translateZ(1000px)`;
            });
        },
        function Grid() {          //  创建 5*5*5 的景深布局
            [...aLi].forEach((n, i) => {
                let x = i % 5,              //  x坐标
                    y = (i % 25) / 5 | 0,       //  y坐标
                    z = i / 25 | 0;         //  z坐标
                let tX = (x - 2) * 260,         //  x轴上每一个相邻的偏移量
                    tY = (y - 2) * 360;         //  y轴上每一个相邻的偏移量
                tZ = (2 - z) * 1000;          //  z轴上每一个相邻的偏移量
                n.style.transform = `translate3D(${tX}px,${tY}px,${tZ}px)`;      //  设置每一个li的偏移量
            });
        },
    ];
    (function () {         //  创建125个li标签
        let html = document.createDocumentFragment();       //  创建文档碎片
        for (let i = 0; i < 125; i++) {
            let list = document.createElement("li");
            let thisData = data[i] || { "order": "118", "name": "Uuo", "mass": "" };
            list.innerHTML += `
                    <p>${thisData.name}</p>
                    <p>${thisData.order}</p>
                    <p>${thisData.mass}</p>
                `;
            html.appendChild(list);         //  把每一个li放进文档碎片里面整理
        }
        box.appendChild(html);          //  然后再文档碎片里面拿出来赋值给 ul#box
        transformFn[3]();
    })();
    (function () {          //  鼠标控制 创建改变视角，改变 Z轴 距离
        let tZ = -2500,     //  设置z轴的初始位置
            rX = 0,
            rY = 0;
        let downX, downY,       //  按下的坐标
            moveX, moveY,       //  移动的坐标
            thisY = rY, thisX = rX,     //  对应的角度值
            disX, disY,      //  最后两次move的间距
            timer = null;
        (function () {
            let ifdown = false;     //  激活和关闭鼠标的按下，移动抬起事件
            document.addEventListener('mousedown', mouseDownEvent);     //  创建鼠标按下事件
            document.addEventListener("mousemove", mouseMoveEvent);     //  创建鼠标移动事件
            document.addEventListener("mouseup", mouseUpEvent);         //  创建鼠标抬起事件
            function mouseDownEvent(e) {
                ifdown = true;
                cancelAnimationFrame(timer);
                disX = 0;
                disY = 0;
                downX = moveX = e.clientX;          //  按下时鼠标的可视区域 X轴 和 Y轴 位置
                downY = moveY = e.clientY;
            }
            function mouseMoveEvent(e) {
                if (!ifdown) return;
                disX = e.clientX - moveX;     //  最后一个点和前一个点在 X轴 和 Y轴 的距离(代表最后两点在 X轴 的转速)
                disY = e.clientY - moveY;
                rY += disX * 0.1;                 //  计算X轴和Y轴的角度
                rX -= disY * 0.1;
                box.style.transform = `translateZ(${tZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
                moveX = e.clientX;          //  鼠标移动时的可视区域 X轴 位置
                moveY = e.clientY;          //  鼠标移动时的可视区域 y轴 位置
                /* let x_ = moveX - downX,         //  鼠标在 X轴 和 Y轴 移动的距离
                    y_ = moveY - downY;
                thisY = rY + x_ * 0.1;      //  X轴 和 Y轴 的旋转角度
                thisX = rX - y_ * 0.1;
                /* let od = document.createElement("div");      //  测试代码，按照鼠标拖动的轨迹，打出相对应的点
                od.style.cssText = `width: 5px; height: 5px; background: red; position: absolute; top: ${moveY}px; left: ${moveX}px;`;
                document.body.appendChild(od); */
            }
            function mouseUpEvent(e) {
                ifdown = false;
                (function m() {
                    if (Math.abs(disX) < 0.5 && Math.abs(disY) < 0.5) return;        //  如果最后两点 X轴 和 Y轴 的转速小于0.5，就停止
                    disY *= 0.97;       //  让 X轴 和 Y轴 的转速逐渐趋向于 0 
                    disX *= 0.97;
                    rX -= disY * 0.1;     //  算出 X轴和Y轴 最后两点的惯性
                    rY += disX * 0.1;
                    box.style.transform = `translateZ(${tZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
                    requestAnimationFrame(m);   //  开启动画
                })();
            }
        })();
        (function () {
            mousewheel(function (e, d) {       //  打印出在不同浏览器里面取到的鼠标滚轮值
                tZ += d * 200;        //  鼠标滚轮每次滚动对 Z轴 的改变
                tZ = Math.min(tZ, 700);      //  限制 Z 轴的最大距离
                tZ = Math.max(tZ, -8000);    //  限制 Z 轴的最小距离
                box.style.transform = `translateZ(${tZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
            });
            function mousewheel(eFn) {
                function fn(e) {
                    let d = e.wheelDelta || -e.detail;     //  一般浏览器兼容火狐的写法
                    d = d / Math.abs(d);        //  将其他浏览器和火狐浏览器返回的e.wheelDelta 和 e.detail值做统一
                    eFn(e, d);
                }
                if (document.onmousewheel === null) {     //  通过判断浏览器里面有没有ommousewheel属性
                    document.addEventListener("mousewheel", fn);        //  一般浏览器鼠标滚轮写法
                } else {
                    document.addEventListener("DOMMouseScroll", fn);        //  火狐浏览器鼠标滚轮写法
                }
            }
        })();
    })();
    (function () {
        let aBtn = document.querySelectorAll(".btn li");
        aBtn.forEach((n, i) => {
            n.onclick = transformFn[i];
        })
    })();
})();