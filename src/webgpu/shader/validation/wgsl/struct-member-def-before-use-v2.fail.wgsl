# v-0006 - Fails because struct 'boo' does not have a member 't'.

type boo = struct {
  z : f32;
};

type goo = struct {
  y : boo;
};

type foo = struct {
  x : goo;
};

[[stage(vertex)]]
fn main() -> void {
  var f : foo;
  f.x.y.t = 2.0;
  return;
}