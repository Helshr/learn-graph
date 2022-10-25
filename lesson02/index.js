const e = (selector) => document.querySelector(selector)
const log = console.log.bind(console)

class Draw {
    constructor(canvas) {
        this.canvas = canvas
        this.context = canvas.getContext("2d")
    }

    _getData = async () => {
        const dataSource = 'https://s5.ssl.qhres2.com/static/b0695e2dd30daa64.json'
        const data = (await fetch(dataSource)).json()
        return data
    }

    drawRect = () => {
        const rectSize = [100, 100]
        const centerPoint = [0.5 * this.canvas.width, 0.5 * this.canvas.height]
        this.context.fillStyle = "red"
        // 告诉canvas现在要绘制的路径 套路
        this.context.beginPath()
        // 保存 canvas 状态
        this.context.save()
        // 将图形移到中心点的位置
        this.context.translate(-0.5 * rectSize[0], -0.5 * rectSize[1])
        // 绘制正方形的宽高都是100, 所以后俩个参数是100
        this.context.rect(...centerPoint, ...rectSize)
        this.context.restore()
        this.context.fill()
    }

    drawTriangle = () => {
        this.context.fillStyle = "red"
        const topPoint = [150, 100]
        const leftPoint = [92.27, 200]
        const rightPoint = [207.73, 200]
        // 告诉canvas现在要绘制的路径 套路
        this.context.beginPath()
        this.context.moveTo(...topPoint)
        this.context.lineTo(...leftPoint)
        this.context.lineTo(...rightPoint)
        this.context.fill()
    }

    drawElliptical = () => {
        this.context.fillStyle = "red"
        const cernterPoint = [150, 150]
        this.context.beginPath()
        this.context.ellipse(...cernterPoint, 90, 40, 0, 0, Math.PI * 2)
        this.context.fill()
    }

    drawPentagram = () => {
        this.context.beginPath();
        var horn = 5; // 画5个角
        var angle = 360/horn; // 五个角的度数
        // 两个圆的半径
        var R = 80;
        var r = 30;
        // 坐标
        var x = 150;
        var y = 150;
        for (var i = 0; i < horn; i++) {
            // 角度转弧度：角度/180*Math.PI
            // 外圆顶点坐标
            this.context.lineTo(Math.cos((18 + i * angle) / 180 * Math.PI) * R + x, -Math.sin((18 + i * angle) / 180 * Math.PI) * R + y);
            // 內圆顶点坐标
            this.context.lineTo(Math.cos((54 + i * angle) / 180 * Math.PI) * r + x, -Math.sin((54 + i * angle) / 180 * Math.PI) * r + y);
        }
        // closePath：关闭路径，将路径的终点与起点相连
        this.context.closePath();
        this.context.lineWidth = "3";
        this.context.fillStyle = '#E4EF00';
        this.context.strokeStyle = "red";
        this.context.fill();
        this.context.stroke();
    }

    // canvas 层次结构
    drawProvince = async () => {
        const data = await this._getData()
        const regions = d3.hierarchy(data)
            .sum(d => 1)
            .sort((a, b) => b.value - a.value)
        // log("regisons: ", regions)
    
        const pack = d3.pack()
            .size([1600, 1600])
            .padding(3)
        
        const root = pack(regions)
        log("root: ", root)
    
        const TAU = 2 * Math.PI
    
        function draw(context, node, {fillStyle = 'rgba(0, 0, 0, 0.2)', textColor = 'white'} = {}) {
            const children = node.children
            const {x, y, r} = node
            context.fillStyle = fillStyle
            context.beginPath()
            context.arc(x, y, r, 0, TAU)
            context.fill()
            // 递归调用
            if(children) {
                for(let i = 0; i < children.length; i++) {
                    draw(context, children[i])
                }
            } else {
                const name = node.data.name
                context.fillStyle = textColor
                context.font = '1.5rem Arial'
                context.textAlign = 'center'
                context.fillText(name, x, y)
            }
        }
    
        draw(this.context, root)
    }
}

const __main = async () => {
    const canvas = e("canvas")
    const draw = new Draw(canvas)
    // 三角形
    // draw.drawTriangle()
    // 椭圆
    // draw.drawElliptical()
    // 五角星
    draw.drawPentagram()
}

__main()