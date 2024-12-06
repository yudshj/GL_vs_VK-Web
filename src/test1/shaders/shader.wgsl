struct VertexIn {
    position_arr: array<vec4<f32>>
};

struct ColorIn {
    color_arr: array<vec4<f32>>
};

@binding(0) @group(0) var<storage, read> vertex_in: VertexIn;   // ball position
@binding(1) @group(0) var<storage, read> color_in: ColorIn;   // ball color

struct Fragment {
    @builtin(position) Position : vec4<f32>,
    @location(0) Color : vec4<f32>
};

@vertex
fn vs_main(
    @builtin(instance_index) id: u32,
    @location(0) vertexPostion: vec4<f32>,
) -> Fragment {

    var output : Fragment;
    output.Position = vec4<f32>((vertexPostion * 0.01 + vertex_in.position_arr[id]).xy, 0.0, 1.0);
    output.Color = color_in.color_arr[id];

    return output;
}

@fragment
fn fs_main(
    @location(0) Color: vec4<f32>
) -> @location(0) vec4<f32> {

    return Color;
}