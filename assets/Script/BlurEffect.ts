import VertAndFrag from './VertAndFrag';
import BlursFrag from './BlursFrag';
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    isDynamic: boolean = false;

    program: cc.GLProgram;
    time: number = 0.0;
    resolution = { x: 0.0, y: 0.0 };

    onLoad() {
        this.resolution.x = this.node.getContentSize().width;
        this.resolution.y = this.node.getContentSize().height;
        this.userBlur();
    }

    start() {
    }

    userBlur() {
        this.program = new cc.GLProgram();
        if (cc.sys.isNative) {
            this.program.initWithString(VertAndFrag.default_vert, BlursFrag.blursFrag);
        } else {
            this.program.initWithVertexShaderByteArray(VertAndFrag.default_vert, BlursFrag.blursFrag);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
        }
        this.program.link();
        this.program.updateUniforms();
        this.program.use();

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
            glProgram_state.setUniformVec2("resolution", this.resolution);
        } else {
            let rl = this.program.getUniformLocationForName("resolution");
            this.program.setUniformLocationWith2f(rl, this.resolution.x, this.resolution.y);
        }
        this.setProgram(this.node.getComponent(cc.Sprite)._sgNode, this.program);
    }

    setProgram(node: any, program: any) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }
    }

}