import {computed, ref, toValue} from "vue"

export const usePageQuery = ({loadFunc, queryParams, pageParams, dataMapper = _ => _}) => {
  const loading = ref(false)
  const dataList = ref([])
  const total = ref(0)

  const sortParams = ref([])

  const load = async () => {
    const params = {
      ...toValue(queryParams),
      ...toValue(pageParams),
    }
    if (sortParams.value) {
      params.sorts = sortParams.value
    }
    try {
      loading.value = true
      const res = await loadFunc(params)
      total.value = parseInt(res.total)
      const tmpData = res.data
      if (dataMapper) {
        dataList.value = tmpData.map(dataMapper)
      } else {
        dataList.value = tmpData
      }
    } catch (e) {
      total.value = 0
      dataList.value = []
      throw e
    } finally {
      loading.value = false
    }
  }

  const onSortChange = ({column, prop, order}) => {
    if (order === null) {
      sortParams.value = []
    } else {
      sortParams.value = [{
        prop: prop,
        order: order
      }]
    }
    pageParams.value.pageNum = 1
    load()
  }

  return {
    loading,
    load,
    total,
    dataList,
    onSortChange
  }
}

export const useTableSelection = () => {

  const selections = ref([])

  const handleSelectionChange = (val) => {
    selections.value = val
  }
  const hasSelection = computed(() => {
    return selections.value.length !== 0
  })

  return {
    selections,
    hasSelection,
    handleSelectionChange
  }
}