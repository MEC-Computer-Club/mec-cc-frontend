/**
 * Liquid Glass Renderer
 * Direct implementation of the optical glass refraction effect from rdev/liquid-glass-react
 * https://github.com/rdev/liquid-glass-react
 *
 * Implements:
 *   - Prominent displacement map sampling (base64 texture)
 *   - 3-channel chromatic aberration dispersion (R, G, B channels displaced separately)
 *   - Edge-weighted aberration mask (clean undistorted center)
 *   - Saturation boost (180% default)
 *   - Continuous rounded-rect SDF card shape with anti-aliasing
 *   - Physical box-shadow (0px 12px 40px rgba(0,0,0,0.25))
 */

import {
  prominentDisplacementMap,
  displacementMap,
  polarDisplacementMap,
} from "./liquidGlassMaps";

export interface LiquidGlassOptions {
  displacementScale: number; // default 30
  blurAmount: number;        // default 0
  saturation: number;        // default 180 (percentage)
  aberrationIntensity: number; // default 2 (customizer)
  cornerRadius: number;      // px
  mode?: "prominent" | "standard" | "polar";
  theme?: "regular" | "frosted" | "dark";
}

export const DEFAULT_LIQUID_GLASS_OPTIONS: LiquidGlassOptions = {
  displacementScale: 30,
  blurAmount: 0,
  saturation: 180,
  aberrationIntensity: 2,
  cornerRadius: 32,
  mode: "prominent",
  theme: "regular",
};

export const SHADOW_PAD = 40; // Extra padding for the 0px 12px 40px drop shadow

const VS_GLASS = `
attribute vec2 a_pos;
uniform vec2 u_center;
uniform vec2 u_size;
uniform vec2 u_res;
uniform float u_pad;
varying vec2 v_localPx;
varying vec2 v_screenUV;
varying vec2 v_cardUV;

void main() {
  vec2 total = u_size + vec2(u_pad * 2.0);
  v_localPx = a_pos * total;
  vec2 px = u_center + a_pos * total;
  v_screenUV = vec2(px.x / u_res.x, 1.0 - px.y / u_res.y);
  // UV normalized across the card [0, 1]
  v_cardUV = (v_localPx + u_size * 0.5) / u_size;
  vec2 ndc = (px / u_res) * 2.0 - 1.0;
  ndc.y = -ndc.y;
  gl_Position = vec4(ndc, 0.0, 1.0);
}`;

const FS_GLASS = `
precision highp float;

uniform sampler2D u_bgTex;
uniform sampler2D u_dispMap;
uniform vec2 u_size;
uniform vec2 u_res;
uniform float u_radius;
uniform float u_displacementScale;
uniform float u_aberration;
uniform float u_saturation;
uniform float u_darkTint;
uniform float u_lightTint;

varying vec2 v_localPx;
varying vec2 v_screenUV;
varying vec2 v_cardUV;

float rrSDF(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + vec2(r);
  return min(max(q.x, q.y), 0.0) + length(max(q, vec2(0.0))) - r;
}

void main() {
  vec2 half_ = u_size * 0.5;
  float r = min(u_radius, min(half_.x, half_.y));
  float sdf = rrSDF(v_localPx, half_, r);

  // 1. Physical drop shadow outside the card (box-shadow: 0px 12px 40px rgba(0, 0, 0, 0.25))
  if (sdf > 0.0) {
    vec2 sLocal = v_localPx - vec2(0.0, 12.0);
    float sSdf = rrSDF(sLocal, half_, r);
    float sDist = max(0.0, sSdf);
    float spread = 40.0;
    float shadow = exp(-sDist * sDist / (spread * spread * 0.45)) * 0.28;
    // subtle contact shadow directly at edge
    float contact = exp(-sDist * 0.12) * 0.15;
    float totalShadow = shadow + contact;
    gl_FragColor = vec4(0.0, 0.0, 0.0, totalShadow);
    return;
  }

  // 2. Anti-aliased mask at card perimeter
  float mask = 1.0 - smoothstep(-1.5, 0.5, sdf);

  // 3. Sample displacement map
  vec2 clampCardUV = clamp(v_cardUV, 0.0, 1.0);
  vec4 disp = texture2D(u_dispMap, clampCardUV);

  // In prominentDisplacementMap: X is disp.r, Y is disp.g!
  // In standard/polar: X is disp.r, Y is disp.b!
  float yDisp = max(disp.g, disp.b);
  vec2 rawOffset = vec2(disp.r - 0.5, yDisp - 0.5);

  // Scale vector (normalized across screen coordinates)
  vec2 d = rawOffset * (u_displacementScale / u_res);

  // 4. Chromatic Aberration channel separation along displacement vector
  // Matches rdev/liquid-glass-react:
  // Red channel: standard displacement
  // Green channel: displacement with (1 + aberration * 0.05) offset
  // Blue channel: displacement with (1 + aberration * 0.10) offset
  vec2 uvR = clamp(v_screenUV - d, 0.0, 1.0);
  vec2 uvG = clamp(v_screenUV - d * (1.0 + u_aberration * 0.05), 0.0, 1.0);
  vec2 uvB = clamp(v_screenUV - d * (1.0 + u_aberration * 0.10), 0.0, 1.0);

  float red   = texture2D(u_bgTex, uvR).r;
  float green = texture2D(u_bgTex, uvG).g;
  float blue  = texture2D(u_bgTex, uvB).b;
  vec3 aberrated = vec3(red, green, blue);

  // 5. Edge mask from displacement intensity (center remains undistorted and crystal clean)
  float edgeIntensity = length(rawOffset);
  float edgeMask = smoothstep(0.015, 0.14, edgeIntensity);

  // 6. Original clean center
  vec3 centerClean = texture2D(u_bgTex, v_screenUV).rgb;

  // Composite edge aberration over clean center
  vec3 col = mix(centerClean, aberrated, edgeMask);

  // 7. Saturation adjustment (default 180% -> 1.8)
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(lum), col, u_saturation);

  // 8. Theme tinting (frosted / dark)
  if (u_darkTint > 0.0) {
    col = mix(col, vec3(0.05, 0.06, 0.08), u_darkTint);
  } else if (u_lightTint > 0.0) {
    col = mix(col, vec3(0.95, 0.96, 0.98), u_lightTint);
  }

  // 9. Subtle glass sheen & specular bevel highlight
  float innerEdge = smoothstep(2.5, 0.0, -sdf);
  col += vec3(innerEdge * 0.10);

  gl_FragColor = vec4(col, mask);
}`;

type UniformMap = Record<string, WebGLUniformLocation | null>;

export class LiquidGlassRenderer {
  readonly canvas: HTMLCanvasElement;
  private readonly gl: WebGLRenderingContext;
  private readonly cropCanvas: HTMLCanvasElement;
  private readonly cropCtx: CanvasRenderingContext2D;

  private prog!: WebGLProgram;
  private uMap!: UniformMap;
  private quadBuf!: WebGLBuffer;

  private bgTex: WebGLTexture | null = null;
  private dispTextures: Map<string, WebGLTexture> = new Map();
  private isContextLost = false;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.cropCanvas = document.createElement("canvas");
    this.cropCtx = this.cropCanvas.getContext("2d", { willReadFrequently: false })!;

    const gl = this.canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      preserveDrawingBuffer: true,
    });

    if (!gl) {
      throw new Error("LiquidGlassRenderer: WebGL is not supported.");
    }
    this.gl = gl;

    this.initProgram();
    this.initBuffers();
    this.preloadDisplacementMaps();

    this.canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      this.isContextLost = true;
    });

    this.canvas.addEventListener("webglcontextrestored", () => {
      this.isContextLost = false;
      this.initProgram();
      this.initBuffers();
      this.bgTex = null;
      this.dispTextures.clear();
      this.preloadDisplacementMaps();
    });
  }

  private compileShader(src: string, type: number): WebGLShader {
    const gl = this.gl;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error("LiquidGlass shader compile failed: " + info);
    }
    return shader;
  }

  private initProgram(): void {
    const gl = this.gl;
    const vs = this.compileShader(VS_GLASS, gl.VERTEX_SHADER);
    const fs = this.compileShader(FS_GLASS, gl.FRAGMENT_SHADER);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(prog);
      throw new Error("LiquidGlass program link failed: " + info);
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    this.prog = prog;

    const names = [
      "u_bgTex", "u_dispMap", "u_center", "u_size", "u_res",
      "u_pad", "u_radius", "u_displacementScale", "u_aberration", "u_saturation",
      "u_darkTint", "u_lightTint"
    ];
    this.uMap = {};
    for (const name of names) {
      this.uMap[name] = gl.getUniformLocation(prog, name);
    }
  }

  private initBuffers(): void {
    const gl = this.gl;
    this.quadBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-.5, -.5, .5, -.5, -.5, .5, .5, .5]),
      gl.STATIC_DRAW
    );
  }

  private createTextureFromImage(img: HTMLImageElement): WebGLTexture {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  private preloadDisplacementMaps(): void {
    const mapEntries = [
      { name: "prominent", src: prominentDisplacementMap },
      { name: "standard", src: displacementMap },
      { name: "polar", src: polarDisplacementMap },
    ];

    for (const entry of mapEntries) {
      const img = new Image();
      img.onload = () => {
        if (!this.isContextLost) {
          const tex = this.createTextureFromImage(img);
          this.dispTextures.set(entry.name, tex);
        }
      };
      img.src = entry.src;
    }
  }

  /**
   * Render liquid glass card background
   */
  public renderGlass(
    sourceCanvas: CanvasImageSource,
    sourceX: number,
    sourceY: number,
    cardWidth: number,
    cardHeight: number,
    pad: number,
    options: LiquidGlassOptions
  ): HTMLCanvasElement | null {
    if (this.isContextLost) return null;

    const gl = this.gl;
    const totalW = Math.round(cardWidth + pad * 2);
    const totalH = Math.round(cardHeight + pad * 2);

    if (totalW <= 0 || totalH <= 0) return null;

    if (this.canvas.width !== totalW || this.canvas.height !== totalH) {
      this.canvas.width = totalW;
      this.canvas.height = totalH;
    }

    // 1. Crop background region beneath card (+ padding for drop shadow)
    // Using 3-argument drawImage with shifted coordinates to safely avoid IndexSizeError
    this.cropCanvas.width = totalW;
    this.cropCanvas.height = totalH;
    this.cropCtx.clearRect(0, 0, totalW, totalH);
    this.cropCtx.drawImage(
      sourceCanvas,
      -(sourceX - pad),
      -(sourceY - pad)
    );

    // 2. Upload background texture
    if (!this.bgTex) {
      this.bgTex = gl.createTexture();
    }
    gl.bindTexture(gl.TEXTURE_2D, this.bgTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.cropCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    // 3. Select displacement map texture
    const mode = options.mode || "prominent";
    let dispTex = this.dispTextures.get(mode);
    if (!dispTex) {
      // Fallback or immediate load if not yet ready
      const img = new Image();
      img.src = mode === "prominent" ? prominentDisplacementMap : mode === "polar" ? polarDisplacementMap : displacementMap;
      if (img.complete && img.naturalWidth > 0) {
        dispTex = this.createTextureFromImage(img);
        this.dispTextures.set(mode, dispTex);
      } else {
        return null; // Wait for texture load
      }
    }

    // 4. Viewport & Clear
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, totalW, totalH);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.prog);

    // Texture Unit 0: Background
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.bgTex);
    gl.uniform1i(this.uMap.u_bgTex, 0);

    // Texture Unit 1: Displacement Map
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, dispTex);
    gl.uniform1i(this.uMap.u_dispMap, 1);

    // Uniforms
    gl.uniform2f(this.uMap.u_res, totalW, totalH);
    gl.uniform2f(this.uMap.u_center, totalW * 0.5, totalH * 0.5);
    gl.uniform2f(this.uMap.u_size, cardWidth, cardHeight);
    gl.uniform1f(this.uMap.u_pad, pad);
    gl.uniform1f(this.uMap.u_radius, options.cornerRadius);

    gl.uniform1f(this.uMap.u_displacementScale, options.displacementScale);
    gl.uniform1f(this.uMap.u_aberration, options.aberrationIntensity);
    gl.uniform1f(this.uMap.u_saturation, options.saturation / 100.0);

    const theme = options.theme || "dark";
    gl.uniform1f(this.uMap.u_darkTint, theme === "dark" ? 0.52 : 0.0);
    gl.uniform1f(this.uMap.u_lightTint, theme === "frosted" ? 0.22 : 0.0);

    // Draw quad
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuf);
    const loc = gl.getAttribLocation(this.prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disableVertexAttribArray(loc);
    gl.disable(gl.BLEND);

    return this.canvas;
  }
}

// Singleton instance
let _instance: LiquidGlassRenderer | null = null;

export function getLiquidGlassRenderer(): LiquidGlassRenderer | null {
  if (typeof window === "undefined") return null;
  if (!_instance) {
    try {
      _instance = new LiquidGlassRenderer();
    } catch (e) {
      console.warn("LiquidGlassRenderer initialization failed:", e);
      return null;
    }
  }
  return _instance;
}
