export type VMSpecifications = {
  cpu_cores: number
  ram_gb: number
  storage_gb: number
  os_type: string
}

export type VMStatus = 'available' | 'sold' | 'reserved' | 'maintenance'

export interface VirtualMachine {
  id: number
  name: string
  description: string
  specifications: VMSpecifications
  price: number
  image_type: string
  status: VMStatus
  created_at: string
  updated_at: string | null
  tags: string[]
}

export type CreateVMInput = Omit<VirtualMachine, 'id' | 'status' | 'created_at' | 'updated_at'>

export type UpdateVMInput = Partial<CreateVMInput> & {
  status?: VMStatus
}

export interface VM {
  id: number
  title: string
  description: string
  longDescription?: string
  price: number
  image?: string
  rating: number
  reviews: number
  provider: string
  tags: string[]
  features: string[]
  regions: string[]
  specs: {
    cpu: string
    ram: string
    storage: string
    network: string
    backup: string
    os: string
  }
} 