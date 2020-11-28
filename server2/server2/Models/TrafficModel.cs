using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server2.Models
{
    [ToString]
    public class TrafficModel
    {
        // timestamp,
/*        Ttl Volume,
            Avg Volume,
            Ttl Through,
            Ttl Left Turn,
            Ttl Right Turn,
            Ttl Wrong Way,
            Overall Avg Speed,
            Zone 2,
            Zone 3,
            Zone 4,
            Zone 5,
            Zone 2.1,
            Zone 3.1,
            Zone 4.1,
            Zone 5.1,
            Class 1:0-22ft,
            Class 2: 22-36ft,
            Class 3: 36-Up, 
            ,
            .1,
            04 Eb Through #1,
            04 Eb Through #3,
            07 Eb Left Turn #1,
            07 Eb Left Turn #2,
            04 Eb Through #1.1,
            04 Eb Through #3.1, 
            07 Eb Left Turn #1.1,
            07 Eb Left Turn #2.1
*/
        public string timestamp { get; set; }
        public string total_volume { get; set; }

        public string avg_volume { get; set; }

        public string total_through { get; set; }

        public string total_left { get; set; }

        public string total_right { get; set; }

        public string total_wrong_way { get; set; }

        public string overall_avg_speed { get; set; }


        public TrafficModel(string time, string t_v, string a_v, string t_t, string t_l, string t_r, string t_ww,
            string o_as)
        {
            this.timestamp = time;
            this.total_volume = t_v;
            this.avg_volume = a_v;
            this.total_through = t_t;
            this.total_left = t_l;
            this.total_right = t_r;
            this.total_wrong_way = t_ww;
            this.overall_avg_speed = o_as;
        }

        public static TrafficModel[] TrafficModelParser(string[][] trafficdata)
        {
            TrafficModel[] tm = new TrafficModel[trafficdata.Length];
            for (int i = 0; i < trafficdata.Length; i++)
            {
                tm[i] = (new TrafficModel(trafficdata[i][0], trafficdata[i][1], trafficdata[i][2], trafficdata[i][3],
                    trafficdata[i][4], trafficdata[i][5], trafficdata[i][6], trafficdata[i][7]));
            }

            return tm;
        }


    }
}
