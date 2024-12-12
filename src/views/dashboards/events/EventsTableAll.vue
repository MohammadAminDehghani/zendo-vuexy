<script setup lang="ts">
import { joinEvent, leaveEvent } from '@/services/db/event';

//import { toRaw } from 'vue';


const { events } = defineProps(['events'])

console.log('1wdw', events)

const user: any = useCookie('userData').value;


const loadingsJoindButtons = ref<boolean[]>([])
const disabledJoindButtons = ref<boolean[]>([])

const handleJoinEvent = (eventId: Number, index: any) => {
  loadingsJoindButtons.value[index] = true
  disabledJoindButtons.value[index] = true
  joinEvent(eventId)
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      disabledJoindButtons.value[index] = false
      console.log('error', err)
    }).finally(() => {
      loadingsJoindButtons.value[index] = false
    });
}

const loadingsLeaveButtons = ref<boolean[]>([])
const disabledLeaveButtons = ref<boolean[]>([])

const handleLeaveEvent = (eventId: Number, index: any) => {
  loadingsLeaveButtons.value[index] = true
  disabledLeaveButtons.value[index] = true
  leaveEvent(eventId)
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      disabledLeaveButtons.value[index] = false
      console.log('error', err)
    }).finally(() => {
      loadingsLeaveButtons.value[index] = false
    });
}





</script>

<template>
  <VCard class="country-order-card">
    <VCardItem title="All Events" subtitle="sort by closet to you!" class="pb-4">
      <template #append>
        <MoreBtn size="small" />
      </template>
    </VCardItem>

    <VTabs grow class="disable-tab-transition">
      <VTab v-for="(tab, index) in tabsData" :key="index">
        {{ tab }}
      </VTab>
    </VTabs>

    <VCardText v-for="(event, index) in events">
      <VWindow>
        <VWindowItem>
          <div>
            <VTimeline align="start" truncate-line="both" side="end" density="compact" line-thickness="1"
              class="v-timeline--variant-outlined">
              <VTimelineItem icon="tabler-circle-check" dot-color="rgba(var(--v-theme-surface))" icon-color="success"
                fill-dot size="20" :elevation="0">
                <div class="text-body-2 text-uppercase text-success">
                  Start
                </div>
                <div class="app-timeline-title">
                  {{ event.title }}
                </div>
                <div class="app-timeline-text">
                  {{ event.origin_address.line1 }} / {{ event.origin_address.city }} / {{ event.origin_address.country
                  }}
                </div>
              </VTimelineItem>
              <VTimelineItem icon="tabler-map-pin" dot-color="rgba(var(--v-theme-surface))" icon-color="primary"
                fill-dot size="20" :elevation="0">
                <div class="text-body-2 text-primary text-uppercase">
                  End
                </div>
                <div class="app-timeline-title">
                  {{ event.destination_address.title }}
                </div>
                <div class="app-timeline-text">
                  {{ event.destination_address.line1 }} / {{ event.destination_address.city }} / {{
                    event.destination_address.country }}
                </div>
                <!-- <VBtn size="small" @click="handleJoinEvent(event.id)">
                  Join
                  <VIcon end icon="tabler-checkbox" />
                </VBtn> -->

                


                <VBtn
                  v-if="event.participants.findIndex((participantUser: any) => participantUser.id === user.id) === -1" 
                  @click="handleJoinEvent(event.id, index)" style="margin: 0.5rem;" size="small"
                  :loading="loadingsJoindButtons[index]" :disabled="disabledJoindButtons[index]" color="primary">
                  Join
                </VBtn>


                <VBtn 
                v-if="event.participants.findIndex((participantUser: any) => participantUser.id === user.id) !== -1" 
                size="small" :loading="loadingsLeaveButtons[index]" :disabled="disabledLeaveButtons[index]"
                  color="error" @click="handleLeaveEvent(event.id, index)">
                  Leave
                </VBtn>
              </VTimelineItem>
            </VTimeline>
            <VDivider class="my-4" style="border-style: dashed;" />
          </div>
        </VWindowItem>

      </VWindow>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.country-order-card {
  .v-timeline .v-timeline-divider__dot .v-timeline-divider__inner-dot {
    box-shadow: none !important;
  }
}
</style>
