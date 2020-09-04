/*
 * LightningChartJS example that showcases LineSeries in a 3D Chart.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    UIElementBuilders,
    UILayoutBuilders,
    AxisTickStrategies,
    Themes
} = lcjs

// Initiate chart
const chart3D = lightningChart().Chart3D({
    // theme: Themes.dark
})

// Get axes for later use
const axes = { x: chart3D.getDefaultAxisX(), y: chart3D.getDefaultAxisY(), z: chart3D.getDefaultAxisZ() }
// Create new point series
const cubeSeries = chart3D.addPointSeries({ pointShape: 'cube' })
const sphereSeries = chart3D.addPointSeries({ pointShape: 'sphere' })

// Layout for UI controls
const layout = chart3D.addUIElement(UILayoutBuilders.Column)
    .setPosition({ x: 100, y: 100 })
    .setOrigin({ x: 1, y: 1 })

// Scale changing
const changeScale = layout.addElement(UIElementBuilders.CheckBox)
    .setText('Change scale')
let normal
changeScale.onSwitch((_, state) => {
    if (state) {
        normal = { min: axes.y.scale.getInnerStart(), max: axes.y.scale.getInnerEnd() }
        axes.y.setInterval(-5, 15, 2000, state)
    } else
        axes.y.setInterval(normal.min, normal.max, 2000, state)
})

// Shape changing
const changeShape = layout.addElement(UIElementBuilders.CheckBox)
    .setText('Change point shape')
    .setOn(true)

// Set the button behavior.
changeShape
    .onSwitch((_, state) => {
        if (state) {
            cubeSeries.restore()
            sphereSeries.dispose()
        } else {
            cubeSeries.dispose()
            sphereSeries.restore()
        }
    })

// Camera rotating
let rotateCamera = false
const rotateCameraButton = layout.addElement(UIElementBuilders.CheckBox)
    .setText('Rotate camera')
rotateCameraButton.onSwitch((_, state) => {
    rotateCamera = state
})
rotateCameraButton.setOn(rotateCamera)

let ang = 0
const dist = 1.5
const animateCameraRotation = () => {
    if (rotateCamera) {
        chart3D.setCameraLocation(
            {
                x: Math.cos(ang) * dist,
                y: 0.50,
                z: Math.sin(ang) * dist
            }
        )

        ang += 0.005
    }

    requestAnimationFrame(animateCameraRotation)
}
animateCameraRotation()

// Axis ticks switching
const ticksButton = layout.addElement(UIElementBuilders.CheckBox)
    .setText('Axis ticks enabled')
ticksButton.onSwitch((_, state) => {
    axes.x.setTickStrategy(state ? AxisTickStrategies.Numeric : AxisTickStrategies.Empty)
    axes.y.setTickStrategy(state ? AxisTickStrategies.Numeric : AxisTickStrategies.Empty)
    axes.z.setTickStrategy(state ? AxisTickStrategies.Numeric : AxisTickStrategies.Empty)
})
ticksButton.setOn(false)

// Set titles for each Axis.
axes.x.setTitle('Axis X')
axes.y.setTitle('Axis Y')
axes.z.setTitle('Axis Z')

// Generate test data.
const generateSeries = () => {
    const points = []
    const pointsMax = 50000
    let angleRadians = 0
    const centerX = 0.5
    const centerZ = -0.5
    const radius = 40
    const stepRadians = Math.PI / 1000
    const a = 20
    const b = 0.025
    const c = 5.0
    const pScale = 10
    for (let j = 0; j < pointsMax; j++) {
        const randomRadius = radius + (Math.random() - 1.0) * radius
        const x = centerX + randomRadius * Math.cos(angleRadians) + a * (Math.random() - 0.5)
        const y = randomRadius * randomRadius * b + a * Math.sin(angleRadians * c) + (Math.random() - 0.5) * a + a
        const z = centerZ + randomRadius * Math.sin(angleRadians) + a * (Math.random() - 0.5)
        const p = { x: 0 + x / pScale, y: 0 + y / pScale - 0.5, z: 0 + z / pScale }
        angleRadians += stepRadians
        points.push(p)
    }
    cubeSeries.add(points)
    sphereSeries.add(points)
    // Hide the sphere series when done adding points to it.
    sphereSeries.dispose()
}

generateSeries()
