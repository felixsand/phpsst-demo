<template>
    <div class="btn-group">
        <button class="btn btn-default btn-sm dropdown-toggle" type="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span class="glyphicon glyphicon-time"></span> <span id="select-days-btn-txt">{{selectDaysBtnText}}</span>&nbsp;&nbsp; <span class="caret"></span>
        </button>
        <ul id="days-select" class="dropdown-menu">
            <li v-for="(label, days) in selectDays">
                <a href="#" :data-days="days" @click="changeDays">{{label}}</a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'nof-days-selector',
        data () {
            return {
                days: 1,
                selectDays: [],
                selectDaysBtnText: 'Valid for 1 day',
            }
        },
        created: function () {
            for (let i = 0; i <= 10; i++) {
                this.selectDays.push(this.getDaysLabel(i));
            }
        },
        methods: {
            getDaysLabel: function (day) {
                let label = day + ' day';
                if (day > 1) {
                    label += 's';
                }

                return label;
            },
            changeDays: function (event) {
                event.preventDefault();
                this.days = event.target.getAttribute('data-days');
                this.selectDaysBtnText = 'Valid for ' + this.getDaysLabel(this.days);
                this.$emit('changed', this.days);
            },
        }
    }
</script>
