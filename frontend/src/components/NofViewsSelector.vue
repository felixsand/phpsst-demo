<template>
    <div class="btn-group">
        <button class="btn btn-default btn-sm dropdown-toggle" type="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span class="glyphicon glyphicon-eye-open"></span>
            <span>{{selectViewsBtnText}}</span>
            <span class="caret"></span>
        </button>
        <ul id="views-select" class="dropdown-menu">
            <li v-for="(label, selectView) in selectViews">
                <a href="#" :data-views="selectView" @click="changeViews">{{label}}</a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'nof-views-selector',
        data () {
            return {
                views: 1,
                selectViews: [],
                selectViewsBtnText: 'Valid for 1 view',
            }
        },
        created () {
            for (let i = 1; i <= 10; i++) {
                this.selectViews[i] = this.getViewsLabel(i);
            }
        },
        methods: {
            getViewsLabel (view) {
                let label = view + ' view';
                if (view > 1) {
                    label += 's';
                }

                return label;
            },
            changeViews (event) {
                event.preventDefault();
                this.views = event.target.getAttribute('data-views');
                this.selectViewsBtnText = 'Valid for ' + this.getViewsLabel(this.views);
                this.$emit('changed', this.views);
            }
        }
    }
</script>
