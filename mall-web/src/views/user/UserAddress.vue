<template>
  <div class="user-address">
    <div class="section-header">
      <h2>收货地址</h2>
      <el-button type="primary" @click="showAddressDialog('add')">新增地址</el-button>
    </div>
    
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>
    
    <div v-else-if="addressList.length === 0" class="empty-address">
      <el-empty description="您还没有添加收货地址" :image-size="120">
        <template #default>
          <el-button type="primary" @click="showAddressDialog('add')">添加收货地址</el-button>
        </template>
      </el-empty>
    </div>
    
    <div v-else class="address-list">
      <div 
        v-for="item in addressList" 
        :key="item.id" 
        class="address-item"
        :class="{ 'is-default': item.isDefault }"
      >
        <div class="address-content">
          <div class="address-info">
            <div class="receiver-info">
              <span class="name">{{ item.name }}</span>
              <span class="phone">{{ item.phone }}</span>
              <el-tag v-if="item.isDefault" size="small" type="success">默认</el-tag>
            </div>
            <div class="address-detail">
              {{ item.province }} {{ item.city }} {{ item.district }} {{ item.detailAddress }}
            </div>
          </div>
          <div class="address-actions">
            <el-button type="text" @click="showAddressDialog('edit', item)">编辑</el-button>
            <el-button type="text" @click="deleteAddress(item.id)">删除</el-button>
            <el-button v-if="!item.isDefault" type="text" @click="setDefault(item.id)">设为默认</el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 新增/编辑地址对话框 -->
    <el-dialog
      v-model="addressDialogVisible"
      :title="dialogType === 'add' ? '新增收货地址' : '编辑收货地址'"
      width="550px"
    >
      <el-form
        ref="addressFormRef"
        :model="addressForm"
        :rules="addressRules"
        label-width="100px"
      >
        <el-form-item label="收货人" prop="name">
          <el-input v-model="addressForm.name" placeholder="请输入收货人姓名" />
        </el-form-item>
        
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addressForm.phone" placeholder="请输入手机号码" />
        </el-form-item>
        
        <el-form-item label="所在地区" prop="region">
          <el-cascader
            v-model="addressForm.region"
            :options="regionData"
            placeholder="请选择所在地区"
          />
        </el-form-item>
        
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input
            v-model="addressForm.detailAddress"
            type="textarea"
            :rows="2"
            placeholder="请输入详细地址信息"
          />
        </el-form-item>
        
        <el-form-item label="邮政编码" prop="postCode">
          <el-input v-model="addressForm.postCode" placeholder="请输入邮政编码" />
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="addressForm.isDefault">设为默认收货地址</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addressDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAddress(addressFormRef)">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

// 模拟地区数据
const regionData = [
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '北京市',
        label: '北京市',
        children: [
          { value: '朝阳区', label: '朝阳区' },
          { value: '海淀区', label: '海淀区' },
          { value: '东城区', label: '东城区' },
          { value: '西城区', label: '西城区' }
        ]
      }
    ]
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      {
        value: '上海市',
        label: '上海市',
        children: [
          { value: '黄浦区', label: '黄浦区' },
          { value: '徐汇区', label: '徐汇区' },
          { value: '长宁区', label: '长宁区' },
          { value: '静安区', label: '静安区' }
        ]
      }
    ]
  }
];

// 表单引用
const addressFormRef = ref<FormInstance>();

// 状态变量
const loading = ref(true);
const addressList = ref<any[]>([]);
const addressDialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');
const currentEditId = ref<number | null>(null);

// 表单数据
const addressForm = reactive({
  name: '',
  phone: '',
  region: [] as string[],
  detailAddress: '',
  postCode: '',
  isDefault: false
});

// 表单验证规则
const addressRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  region: [
    { required: true, message: '请选择所在地区', trigger: 'change' }
  ],
  detailAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  postCode: [
    { pattern: /^\d{6}$/, message: '请输入正确的邮政编码', trigger: 'blur' }
  ]
});

/**
 * 获取收货地址列表
 * @example
 * fetchAddressList()
 */
const fetchAddressList = async () => {
  loading.value = true;
  try {
    // 这里应该是API调用，暂时使用模拟数据
    setTimeout(() => {
      addressList.value = [
        {
          id: 1,
          name: '张三',
          phone: '13800138000',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          detailAddress: '三里屯SOHO 5号楼3层301室',
          postCode: '100000',
          isDefault: true
        },
        {
          id: 2,
          name: '李四',
          phone: '13900139000',
          province: '上海市',
          city: '上海市',
          district: '静安区',
          detailAddress: '南京西路1266号恒隆广场28楼',
          postCode: '200000',
          isDefault: false
        }
      ];
      loading.value = false;
    }, 1000);
  } catch (error) {
    console.error('获取地址列表失败:', error);
    ElMessage.error('获取地址列表失败');
    loading.value = false;
  }
};

/**
 * 显示地址对话框
 * @param type 对话框类型
 * @param item 编辑的地址数据
 * @example
 * showAddressDialog('add')
 * showAddressDialog('edit', {id: 1, name: '张三'})
 */
const showAddressDialog = (type: 'add' | 'edit', item?: any) => {
  dialogType.value = type;
  addressDialogVisible.value = true;
  
  // 重置表单
  if (addressFormRef.value) {
    addressFormRef.value.resetFields();
  }
  
  if (type === 'edit' && item) {
    currentEditId.value = item.id;
    addressForm.name = item.name;
    addressForm.phone = item.phone;
    addressForm.region = [item.province, item.city, item.district];
    addressForm.detailAddress = item.detailAddress;
    addressForm.postCode = item.postCode;
    addressForm.isDefault = item.isDefault;
  } else {
    currentEditId.value = null;
  }
};

/**
 * 保存地址
 * @param formEl 表单实例
 * @example
 * saveAddress(addressFormRef)
 */
const saveAddress = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        // 这里应该是API调用，暂时使用模拟数据处理
        const [province, city, district] = addressForm.region;
        
        if (dialogType.value === 'add') {
          // 新增地址
          const newAddress = {
            id: Date.now(),
            name: addressForm.name,
            phone: addressForm.phone,
            province,
            city,
            district,
            detailAddress: addressForm.detailAddress,
            postCode: addressForm.postCode,
            isDefault: addressForm.isDefault
          };
          
          if (addressForm.isDefault) {
            // 将其他地址设为非默认
            addressList.value.forEach(item => {
              item.isDefault = false;
            });
          }
          
          addressList.value.push(newAddress);
          ElMessage.success('添加地址成功');
        } else {
          // 编辑地址
          const index = addressList.value.findIndex(item => item.id === currentEditId.value);
          if (index !== -1) {
            const updatedAddress = {
              ...addressList.value[index],
              name: addressForm.name,
              phone: addressForm.phone,
              province,
              city,
              district,
              detailAddress: addressForm.detailAddress,
              postCode: addressForm.postCode,
              isDefault: addressForm.isDefault
            };
            
            if (addressForm.isDefault) {
              // 将其他地址设为非默认
              addressList.value.forEach(item => {
                item.isDefault = false;
              });
            }
            
            addressList.value.splice(index, 1, updatedAddress);
            ElMessage.success('更新地址成功');
          }
        }
        
        addressDialogVisible.value = false;
      } catch (error) {
        console.error('保存地址失败:', error);
        ElMessage.error('保存地址失败');
      }
    }
  });
};

/**
 * 删除地址
 * @param id 地址ID
 * @example
 * deleteAddress(1)
 */
const deleteAddress = (id: number) => {
  ElMessageBox.confirm('确定要删除这个收货地址吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该是API调用，暂时使用本地数据处理
    const index = addressList.value.findIndex(item => item.id === id);
    if (index !== -1) {
      addressList.value.splice(index, 1);
      ElMessage.success('删除地址成功');
    }
  }).catch(() => {
    // 用户取消操作
  });
};

/**
 * 设置默认地址
 * @param id 地址ID
 * @example
 * setDefault(1)
 */
const setDefault = (id: number) => {
  // 这里应该是API调用，暂时使用本地数据处理
  addressList.value.forEach(item => {
    item.isDefault = item.id === id;
  });
  ElMessage.success('设置默认地址成功');
};

// 组件挂载时获取地址列表
onMounted(() => {
  fetchAddressList();
});
</script>

<style lang="scss" scoped>
.user-address {
  padding: 20px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      font-size: 18px;
      font-weight: 500;
      margin: 0;
    }
  }
  
  .loading-container {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .empty-address {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .address-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    
    .address-item {
      background-color: #fff;
      border-radius: 8px;
      border: 1px solid #ebeef5;
      padding: 20px;
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }
      
      &.is-default {
        border-color: #67c23a;
        background-color: #f0f9eb;
      }
      
      .address-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        
        @media (max-width: 768px) {
          flex-direction: column;
        }
        
        .address-info {
          flex: 1;
          
          .receiver-info {
            margin-bottom: 10px;
            
            .name {
              font-size: 16px;
              font-weight: 500;
              margin-right: 15px;
            }
            
            .phone {
              color: #606266;
              margin-right: 15px;
            }
          }
          
          .address-detail {
            color: #606266;
            line-height: 1.5;
          }
        }
        
        .address-actions {
          display: flex;
          gap: 10px;
          
          @media (max-width: 768px) {
            margin-top: 15px;
          }
        }
      }
    }
  }
}

.el-cascader {
  width: 100%;
}
</style> 