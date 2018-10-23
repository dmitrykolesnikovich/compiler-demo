import * as llvm from "llvm-node"

// Context
let context = new llvm.LLVMContext

// Native Types
type IntT = { t: llvm.Type, signed: boolean }
let Int8Type = llvm.Type.getInt8Ty(context)
function getInt8Type() : IntT {
  return { t: Int8Type, signed: true }
}
let Int16Type = llvm.Type.getInt16Ty(context)
function getInt16Type() : IntT {
  return { t: Int16Type, signed: true }
}
let Int32Type = llvm.Type.getInt32Ty(context)
function getInt32Type() : IntT {
  return { t: Int32Type, signed: true }
}
let Int64Type = llvm.Type.getInt64Ty(context)
function getInt64Type() : IntT {
  return { t: Int64Type, signed: true }
}

let Uint8Type = llvm.Type.getInt8Ty(context)
function getUint8Type() : IntT {
  return { t: Uint8Type, signed: false }
}
let Uint16Type = llvm.Type.getInt16Ty(context)
function getUint16Type() : IntT {
  return { t: Uint16Type, signed: false }
}
let Uint32Type = llvm.Type.getInt32Ty(context)
function getUint32Type() : IntT {
  return { t: Uint32Type, signed: false }
}
let Uint64Type = llvm.Type.getInt64Ty(context)
function getUint64Type() : IntT {
  return { t: Uint64Type, signed: false }
}

// TODO : add Float16Type once getHalfTy() is in the API
// let Float16Type = llvm.Type.getFloatTy(context)
// function getFloat16Type() : { t: llvm.Type } {
//   return { t: Float16Type }
// }
type FloatT = { t: llvm.Type }
let Float32Type = llvm.Type.getFloatTy(context)
function getFloat32Type() : FloatT {
  return { t: Float32Type }
}
let Float64Type = llvm.Type.getDoubleTy(context)
function getFloat64Type() : FloatT {
  return { t: Float64Type }
}

type BoolT = { t: llvm.Type, bool: boolean }
let BoolType = llvm.Type.getInt8Ty(context)
function getBoolType() : BoolT {
  return { t: BoolType, bool: true }
}

type VoidT = { t: llvm.Type }
let VoidType = llvm.Type.getVoidTy(context)
function getVoidType() : VoidT {
  return { t: VoidType }
}

type StringT = { t: llvm.Type, count: number }
let StringType = llvm.Type.getInt8Ty(context)
function getStringType(count: number) : StringT {
  return { t: llvm.ArrayType.get(StringType, count), count: count }
}

// Scopes
function createModule(name: string) : llvm.Module {
  return new llvm.Module(name, context)
}

type Main = { mainBlock: llvm.BasicBlock, mainBuilder: llvm.IRBuilder, mainReturnAlloca: llvm.AllocaInst}
function createMain(llvmModule: llvm.Module) : Main {
  let intType = llvm.Type.getInt32Ty(context)
  let mainFuncType = llvm.FunctionType.get(intType, false)
  let mainFunc = llvmModule.getOrInsertFunction("main", mainFuncType)
  let mainBlock = llvm.BasicBlock.create(context, "", mainFunc as llvm.Function)
  let mainBuilder = new llvm.IRBuilder(mainBlock)
  let mainReturnAlloca = mainBuilder.createAlloca(intType)

  mainBuilder.createStore(createConstant(2), mainReturnAlloca)
  mainBuilder.createRet(mainBuilder.createLoad(mainReturnAlloca))

  return { mainBlock, mainBuilder, mainReturnAlloca }
}

// Values
function createConstant(value: number) : llvm.Value {
  return llvm.ConstantInt.get(context, value)
}

// Debug log IR
function logIR(llvmModule: llvm.Module) {
  console.log(llvmModule.print())
}

// Write bitcode to file
function writeBitcodeToFile(llvmModule: llvm.Module, filePath: string) {
  llvm.writeBitcodeToFile(llvmModule, filePath)
}

function test() {
  let m = createModule("test")

  createMain(m)

  logIR(m)
  writeBitcodeToFile(m, "./lol.bit")

  // Bash:
  // =====
  // ts-node src/llvm-demo.ts
  // llc -o lol.asm lol.bit
  // llvm-as -i lol lol.asm
}

test()
