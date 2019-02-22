const { useEffect, useRef } = React = require('react')
const { connect } = require('react-redux')

const h = require('../utils/h')

const Guides = require('../window/guides')

const mapStateToProps = state => ({
  visible: state.mainViewCamera === 'live',
  center: state.workspace.guides.center,
  thirds: state.workspace.guides.thirds,
  eyeline: state.workspace.guides.eyeline,

  // DEBUG uncomment these to debug the perspective guide in realtime
  // camera: state.sceneObjects[state.activeCamera],
  // aspectRatio: state.aspectRatio
})

const GuidesView = ({
  // props
  width, height,

  // from state
  visible, center, thirds, eyeline,

  // DEBUG uncomment these to debug the perspective guide in realtime
  // camera,
  // aspectRatio
}) => {
  const guidesCanvasRef = useRef()
  const guides = useRef()

  let dimensions = { width, height }

  useEffect(() => {
    if (!dimensions.width) return

    if (!guides.current) {
      guides.current = new Guides({
        width: dimensions.width,
        height: dimensions.height
      })
    }

    guides.current.canvas = guidesCanvasRef.current
    guides.current.context = guidesCanvasRef.current.getContext('2d')

    guides.current.width = dimensions.width
    guides.current.height = dimensions.height
    guides.current.canvas.width = guides.current.width
    guides.current.canvas.height = guides.current.height
    guides.current.offscreenCanvas.width = guides.current.width
    guides.current.offscreenCanvas.height = guides.current.height

    guides.current.setState({ center, thirds, eyeline })
  }, [dimensions, center, thirds, eyeline])

  // DEBUG uncomment to test perspective guide in real-time
  // try {
  //   if (guides.current) {
  //     guides.current.perspectiveParams = { camera, aspectRatio }
  //     guides.current.setState({ center, thirds, eyeline, perspective: true })
  //   }
  // } catch (err) {
  //   console.warn(err)
  // }

  return h([
    'canvas',
    { key: 'guides-canvas',
      ref: guidesCanvasRef,
      id: 'guides-canvas',
      ...dimensions,
      style: {
        ...dimensions,
        visibility: visible ? 'visible' : 'hidden'
      }
    }
  ])
}

module.exports = connect(mapStateToProps)(
  React.memo(GuidesView)
)