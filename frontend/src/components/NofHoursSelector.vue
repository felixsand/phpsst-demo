<template>
    <div class="btn-group">
        <button class="btn btn-default btn-sm dropdown-toggle" type="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span id="select-hours-btn-txt">{{selectHoursBtnText}}</span> <span class="caret"></span>
        </button>
        <ul id="hours-select" class="dropdown-menu">
            <li v-for="(label, hours) in selectHours" :key="hours">
                <a href="#" :data-hours="hours" @click="changeHours">{{label}}</a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'nof-hours-selector',
        data () {
            return {
                hours: 0,
                selectHours: [],
                selectHoursBtnText: 'and 0 hour',
            }
        },
        created () {
            for (let i = 0; i <= 23; i++) {
                this.selectHours.push(this.getHoursLabel(i));
            }
        },
        methods: {
            getHoursLabel (hour) {
                let label = hour + ' hour';
                if (hour > 1) {
                    label += 's';
                }

                return label;
            },
            changeHours (event) {
                event.preventDefault();
                this.hours = event.target.getAttribute('data-hours');
                this.selectHoursBtnText = 'and ' + this.getHoursLabel(this.hours);
                this.$emit('changed', this.hours);
            }
        }
    }
</script>
